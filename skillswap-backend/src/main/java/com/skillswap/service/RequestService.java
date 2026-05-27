package com.skillswap.service;
import com.skillswap.dto.request.CreateSessionRequest;
import com.skillswap.dto.response.SessionRequestResponse;
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
public class RequestService {
    private final SessionRequestRepository reqRepo;
    private final SkillRepository skillRepo;
    private final UserRepository userRepo;
    private final SessionRepository sessionRepo;
    private final NotificationService notifService;
    private final ActivityLogService logService;
    public List<SessionRequestResponse> getSent(Long uid) {
        return reqRepo.findByRequesterIdOrderByCreatedAtDesc(uid).stream().map(SessionRequestResponse::from).collect(Collectors.toList());
    }
    public List<SessionRequestResponse> getReceived(Long uid) {
        return reqRepo.findReceivedByOwner(uid).stream().map(SessionRequestResponse::from).collect(Collectors.toList());
    }
    @Transactional
    public SessionRequestResponse create(Long uid, CreateSessionRequest dto) {
        if (dto.getPreferredDate().isBefore(LocalDate.now())) throw new BadRequestException("Date must be in the future.");
        Skill skill = skillRepo.findById(dto.getSkillId()).orElseThrow(()->new ResourceNotFoundException("Skill",dto.getSkillId()));
        if (skill.getUser().getId().equals(uid)) throw new BadRequestException("You cannot request your own skill.");
        if (!skill.getIsActive()) throw new BadRequestException("This skill is not available.");
        User requester = userRepo.findById(uid).orElseThrow(()->new ResourceNotFoundException("User",uid));
        SessionRequest r = SessionRequest.builder().skill(skill).requester(requester)
                .preferredDate(dto.getPreferredDate()).preferredTime(dto.getPreferredTime())
                .message(dto.getMessage()).build();
        SessionRequest saved = reqRepo.save(r);
        notifService.send(skill.getUser().getId(),"New session request!",requester.getFullName()+" wants to learn "+skill.getSkillName()+" from you.","REQUEST",saved.getId());
        logService.log(requester,"REQUEST_CREATED","Requested: "+skill.getSkillName());
        return SessionRequestResponse.from(saved);
    }
    @Transactional
    public SessionRequestResponse accept(Long id, Long teacherId) {
        SessionRequest r = pending(id);
        if (!r.getSkill().getUser().getId().equals(teacherId)) throw new BadRequestException("Not your skill.");
        r.setStatus("ACCEPTED"); reqRepo.save(r);
        Session s = Session.builder().request(r).skill(r.getSkill()).teacher(r.getSkill().getUser())
                .learner(r.getRequester()).sessionDate(r.getPreferredDate()).startTime(r.getPreferredTime())
                .endTime(r.getPreferredTime().plusHours(1)).location("TBD").build();
        sessionRepo.save(s);
        notifService.send(r.getRequester().getId(),"Request accepted! 🎉",r.getSkill().getUser().getFullName()+" accepted your request for "+r.getSkill().getSkillName()+".","ACCEPTED",id);
        logService.log(r.getSkill().getUser(),"REQUEST_ACCEPTED","Accepted request for "+r.getSkill().getSkillName());
        return SessionRequestResponse.from(r);
    }
    @Transactional
    public SessionRequestResponse reject(Long id, Long teacherId, String reason) {
        SessionRequest r = pending(id);
        if (!r.getSkill().getUser().getId().equals(teacherId)) throw new BadRequestException("Not your skill.");
        r.setStatus("REJECTED"); reqRepo.save(r);
        String msg = r.getSkill().getUser().getFullName()+" declined your request for "+r.getSkill().getSkillName()+".";
        if (reason!=null && !reason.isBlank()) msg += " Reason: "+reason;
        notifService.send(r.getRequester().getId(),"Request declined",msg,"REJECTED",id);
        return SessionRequestResponse.from(r);
    }
    @Transactional
    public void cancel(Long id, Long uid) {
        SessionRequest r = reqRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Request",id));
        if (!r.getRequester().getId().equals(uid)) throw new BadRequestException("Not your request.");
        if (!"PENDING".equals(r.getStatus())) throw new BadRequestException("Only pending requests can be cancelled.");
        r.setStatus("CANCELLED"); reqRepo.save(r);
    }
    public List<SessionRequestResponse> adminGetAll(String status) {
        return reqRepo.findAllFiltered(status==null?"":status).stream().map(SessionRequestResponse::from).collect(Collectors.toList());
    }
    @Transactional
    public void adminCancel(Long id) {
        SessionRequest r = reqRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Request",id));
        r.setStatus("CANCELLED"); reqRepo.save(r);
    }
    private SessionRequest pending(Long id) {
        SessionRequest r = reqRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("Request",id));
        if (!"PENDING".equals(r.getStatus())) throw new BadRequestException("Request is no longer pending.");
        return r;
    }
}
