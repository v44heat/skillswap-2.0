package com.skillswap.controller;
import com.skillswap.dto.request.FeedbackRequest;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/feedback") @RequiredArgsConstructor
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @PostMapping public ResponseEntity<Void> submit(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody FeedbackRequest req) { feedbackService.submit(uid(p),req); return ResponseEntity.status(HttpStatus.CREATED).build(); }
}
