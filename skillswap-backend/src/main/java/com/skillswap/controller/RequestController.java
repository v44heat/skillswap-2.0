package com.skillswap.controller;
import com.skillswap.dto.request.CreateSessionRequest;
import com.skillswap.dto.response.SessionRequestResponse;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/requests") @RequiredArgsConstructor
public class RequestController {
    private final RequestService requestService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @GetMapping("/sent") public ResponseEntity<List<SessionRequestResponse>> sent(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(requestService.getSent(uid(p))); }
    @GetMapping("/received") public ResponseEntity<List<SessionRequestResponse>> received(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(requestService.getReceived(uid(p))); }
    @PostMapping public ResponseEntity<SessionRequestResponse> create(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody CreateSessionRequest req) { return ResponseEntity.status(HttpStatus.CREATED).body(requestService.create(uid(p),req)); }
    @PutMapping("/{id}/accept") public ResponseEntity<SessionRequestResponse> accept(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(requestService.accept(id,uid(p))); }
    @PutMapping("/{id}/reject") public ResponseEntity<SessionRequestResponse> reject(@AuthenticationPrincipal UserDetails p, @PathVariable Long id, @RequestBody(required=false) Map<String,String> body) { return ResponseEntity.ok(requestService.reject(id,uid(p),body!=null?body.get("reason"):null)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> cancel(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { requestService.cancel(id,uid(p)); return ResponseEntity.noContent().build(); }
}
