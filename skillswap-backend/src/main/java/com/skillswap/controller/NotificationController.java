package com.skillswap.controller;
import com.skillswap.dto.response.NotificationResponse;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/notifications") @RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notifService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @GetMapping public ResponseEntity<List<NotificationResponse>> all(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(notifService.getForUser(uid(p))); }
    @PutMapping("/{id}/read") public ResponseEntity<NotificationResponse> read(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(notifService.markRead(id,uid(p))); }
    @PutMapping("/read-all") public ResponseEntity<Void> readAll(@AuthenticationPrincipal UserDetails p) { notifService.markAllRead(uid(p)); return ResponseEntity.ok().build(); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { notifService.delete(id,uid(p)); return ResponseEntity.noContent().build(); }
}
