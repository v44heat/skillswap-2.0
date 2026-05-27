package com.skillswap.controller;
import com.skillswap.dto.response.SessionResponse;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/sessions") @RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @GetMapping("/upcoming") public ResponseEntity<List<SessionResponse>> upcoming(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(sessionService.getUpcoming(uid(p))); }
    @GetMapping("/past") public ResponseEntity<List<SessionResponse>> past(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(sessionService.getPast(uid(p))); }
    @GetMapping("/{id}") public ResponseEntity<SessionResponse> byId(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(sessionService.getById(id,uid(p))); }
    @PutMapping("/{id}/complete") public ResponseEntity<SessionResponse> complete(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(sessionService.markComplete(id,uid(p))); }
    @PutMapping("/{id}/cancel") public ResponseEntity<SessionResponse> cancel(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(sessionService.cancel(id,uid(p))); }
}
