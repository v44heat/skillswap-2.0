package com.skillswap.controller;
import com.skillswap.dto.request.SkillRequest;
import com.skillswap.dto.response.SkillResponse;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/skills") @RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;
    private final UserRepository userRepo;
    private Long uid(UserDetails p) { return userRepo.findByEmail(p.getUsername()).orElseThrow().getId(); }
    @GetMapping("/my") public ResponseEntity<List<SkillResponse>> my(@AuthenticationPrincipal UserDetails p) { return ResponseEntity.ok(skillService.getMy(uid(p))); }
    @PostMapping public ResponseEntity<SkillResponse> create(@AuthenticationPrincipal UserDetails p, @Valid @RequestBody SkillRequest req) { return ResponseEntity.status(HttpStatus.CREATED).body(skillService.create(uid(p),req)); }
    @PutMapping("/{id}") public ResponseEntity<SkillResponse> update(@AuthenticationPrincipal UserDetails p, @PathVariable Long id, @Valid @RequestBody SkillRequest req) { return ResponseEntity.ok(skillService.update(id,uid(p),req)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails p, @PathVariable Long id) { skillService.delete(id,uid(p)); return ResponseEntity.noContent().build(); }
    @GetMapping("/browse") public ResponseEntity<List<SkillResponse>> browse(@AuthenticationPrincipal UserDetails p, @RequestParam(required=false) String search, @RequestParam(required=false) String category, @RequestParam(required=false) String proficiency) { return ResponseEntity.ok(skillService.browse(uid(p),search,category,proficiency)); }
}
