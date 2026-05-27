package com.skillswap.controller;
import com.skillswap.dto.request.*;
import com.skillswap.dto.response.UserResponse;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users") @RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @GetMapping("/profile") public ResponseEntity<UserResponse> profile(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(userService.getProfile(uid(p))); }
    @PutMapping("/profile") public ResponseEntity<UserResponse> update(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody UpdateProfileRequest req) { return ResponseEntity.ok(userService.updateProfile(uid(p),req)); }
    @PutMapping("/password") public ResponseEntity<Void> password(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody ChangePasswordRequest req) { userService.changePassword(uid(p),req); return ResponseEntity.ok().build(); }
    @GetMapping("/{id}") public ResponseEntity<UserResponse> byId(@PathVariable Long id) { return ResponseEntity.ok(userService.getById(id)); }
}
