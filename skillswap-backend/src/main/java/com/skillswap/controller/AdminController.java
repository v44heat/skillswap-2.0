package com.skillswap.controller;
import com.skillswap.dto.request.*;
import com.skillswap.dto.response.*;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final SkillService skillService;
    private final RequestService requestService;
    private final SessionService sessionService;
    private final UserRepository userRepo;
    private User current(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow(); }
    @GetMapping("/stats") public ResponseEntity<AdminStatsResponse> stats() { return ResponseEntity.ok(adminService.getStats()); }
    @GetMapping("/users") public ResponseEntity<List<UserResponse>> users(@RequestParam(required=false) String search) { return ResponseEntity.ok(adminService.getUsers(search)); }
    @GetMapping("/users/{id}") public ResponseEntity<UserResponse> user(@PathVariable Long id) { return ResponseEntity.ok(adminService.getUser(id)); }
    @PutMapping("/users/{id}") public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateProfileRequest req) { return ResponseEntity.ok(adminService.updateUser(id,req)); }
    @DeleteMapping("/users/{id}") public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { adminService.deleteUser(id,current(p)); return ResponseEntity.noContent().build(); }
    @PostMapping("/users/{id}/reset-password") public ResponseEntity<Void> resetPw(@AuthenticationPrincipal UserDetails p, @PathVariable Long id, @Valid @RequestBody ResetPasswordRequest req) { adminService.resetPassword(id,req,current(p)); return ResponseEntity.ok().build(); }
    @PutMapping("/users/{id}/suspend") public ResponseEntity<UserResponse> suspend(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { return ResponseEntity.ok(adminService.toggleSuspend(id,current(p))); }
    @GetMapping("/skills") public ResponseEntity<List<SkillResponse>> skills(@RequestParam(required=false) String search, @RequestParam(required=false) String category) { return ResponseEntity.ok(skillService.adminGetAll(search,category)); }
    @DeleteMapping("/skills/{id}") public ResponseEntity<Void> deleteSkill(@PathVariable Long id) { skillService.adminDelete(id); return ResponseEntity.noContent().build(); }
    @PutMapping("/skills/{id}/toggle") public ResponseEntity<SkillResponse> toggleSkill(@PathVariable Long id) { return ResponseEntity.ok(skillService.adminToggle(id)); }
    @GetMapping("/requests") public ResponseEntity<List<SessionRequestResponse>> requests(@RequestParam(required=false) String status) { return ResponseEntity.ok(requestService.adminGetAll(status)); }
    @PutMapping("/requests/{id}/cancel") public ResponseEntity<Void> cancelReq(@PathVariable Long id) { requestService.adminCancel(id); return ResponseEntity.ok().build(); }
    @GetMapping("/sessions") public ResponseEntity<List<SessionResponse>> sessions(@RequestParam(required=false) String status) { return ResponseEntity.ok(sessionService.adminGetAll(status)); }
    @PutMapping("/sessions/{id}/cancel") public ResponseEntity<Void> cancelSess(@PathVariable Long id) { sessionService.adminCancel(id); return ResponseEntity.ok().build(); }
    @GetMapping("/activity") public ResponseEntity<List<ActivityLogResponse>> logs(@RequestParam(required=false) Long userId, @RequestParam(required=false) String action) { return ResponseEntity.ok(adminService.getLogs(userId,action)); }
}
