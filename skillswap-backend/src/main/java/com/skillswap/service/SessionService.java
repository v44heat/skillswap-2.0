package com.skillswap.service;
import com.skillswap.dto.response.SessionResponse;
import com.skillswap.exception.*;
import com.skillswap.model.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class SessionService {
    private final SessionRepository sessionRepo;
    private final FeedbackRepository feedbackRepo;
    private final NotificationService notifService;
    private final ActivityLogService logService;
    public List<SessionResponse> getUpcoming(Long uid) {
        return sessionRepo.findUpcoming(uid,LocalDate.now()).stream()
                .map(s->SessionResponse.from(s,feedbackRepo.existsBySessionIdAndReviewerId(s.getId(),uid))).collect(Collectors.toList());
    }
    public List<SessionResponse> getPast(Long uid) {
        return sessionRepo.findPast(uid,LocalDate.now()).stream()
                .map(s->SessionResponse.from(s,feedbackRepo.existsBySessionIdAndReviewerId(s.getId(),uid))).collect(Collectors.toList());
    }
    public SessionResponse getById(Long id, Long uid) {
        Session s = sessionRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Session",id));
        if (!s.getTeacher().getId().equals(uid)&&!s.getLearner().getId().equals(uid)) throw new BadRequestException("Not your session.");
        return SessionResponse.from(s,feedbackRepo.existsBySessionIdAndReviewerId(id,uid));
    }
    @Transactional
    public SessionResponse markComplete(Long id, Long teacherId) {
        Session s = sessionRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Session",id));
        if (!s.getTeacher().getId().equals(teacherId)) throw new BadRequestException("Only the teacher can complete a session.");
        if (!"CONFIRMED".equals(s.getStatus())) throw new BadRequestException("Session is not confirmed.");
        s.setStatus("COMPLETED");
        sessionRepo.save(s);
        notifService.send(s.getLearner().getId(),"Session completed!","Your session for "+s.getSkill().getSkillName()+" is complete. Please leave feedback!","INFO",id);
        logService.log(s.getTeacher(),"SESSION_COMPLETED","Completed: "+s.getSkill().getSkillName());
        return SessionResponse.from(s,false);
    }
    @Transactional
    public SessionResponse cancel(Long id, Long uid) {
        Session s = sessionRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Session",id));
        if (!s.getTeacher().getId().equals(uid)&&!s.getLearner().getId().equals(uid)) throw new BadRequestException("Not your session.");
        if (!"CONFIRMED".equals(s.getStatus())) throw new BadRequestException("Only confirmed sessions can be cancelled.");
        s.setStatus("CANCELLED"); sessionRepo.save(s);
        Long otherId = s.getTeacher().getId().equals(uid)?s.getLearner().getId():s.getTeacher().getId();
        notifService.send(otherId,"Session cancelled","Your session for "+s.getSkill().getSkillName()+" was cancelled.","INFO",id);
        return SessionResponse.from(s,false);
    }
    public List<SessionResponse> adminGetAll(String status) {
        return sessionRepo.findAllFiltered(status==null?"":status).stream()
                .map(s->SessionResponse.from(s,false)).collect(Collectors.toList());
    }
    @Transactional
    public void adminCancel(Long id) {
        Session s = sessionRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Session",id));
        s.setStatus("CANCELLED"); sessionRepo.save(s);
        notifService.send(s.getTeacher().getId(),"Session cancelled by admin","Your session for "+s.getSkill().getSkillName()+" was cancelled.","ADMIN",id);
        notifService.send(s.getLearner().getId(),"Session cancelled by admin","Your session for "+s.getSkill().getSkillName()+" was cancelled.","ADMIN",id);
    }
}
