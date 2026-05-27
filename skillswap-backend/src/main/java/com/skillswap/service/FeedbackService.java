package com.skillswap.service;
import com.skillswap.dto.request.FeedbackRequest;
import com.skillswap.exception.*;
import com.skillswap.model.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepo;
    private final SessionRepository sessionRepo;
    private final UserRepository userRepo;
    private final NotificationService notifService;
    private final ActivityLogService logService;
    @Transactional
    public void submit(Long reviewerId, FeedbackRequest req) {
        Session s = sessionRepo.findById(req.getSessionId()).orElseThrow(()->new ResourceNotFoundException("Session",req.getSessionId()));
        if (!s.getLearner().getId().equals(reviewerId)) throw new BadRequestException("Only the learner can submit feedback.");
        if (!"COMPLETED".equals(s.getStatus())) throw new BadRequestException("Session must be completed first.");
        if (feedbackRepo.existsBySessionIdAndReviewerId(req.getSessionId(),reviewerId)) throw new BadRequestException("You have already rated this session.");
        User reviewer = userRepo.findById(reviewerId).orElseThrow(()->new ResourceNotFoundException("User",reviewerId));
        feedbackRepo.save(Feedback.builder().session(s).reviewer(reviewer).reviewee(s.getTeacher()).rating(req.getRating()).comment(req.getComment()).build());
        notifService.send(s.getTeacher().getId(),"New feedback ⭐",reviewer.getFullName()+" rated your session "+req.getRating()+"/5.","FEEDBACK",s.getId());
        logService.log(reviewer,"FEEDBACK_SUBMITTED","Rated "+s.getSkill().getSkillName()+" "+req.getRating()+"/5");
    }
}
