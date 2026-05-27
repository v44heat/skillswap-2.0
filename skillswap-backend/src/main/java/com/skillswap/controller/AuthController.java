package com.skillswap.controller;
import com.skillswap.dto.request.*;
import com.skillswap.dto.response.*;
import com.skillswap.exception.BadRequestException;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import com.skillswap.security.JwtTokenProvider;
import com.skillswap.service.ActivityLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService logService;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new BadRequestException("Email already registered.");
        if (userRepo.existsByStudentId(req.getStudentId())) throw new BadRequestException("Student ID already registered.");
        User user = User.builder().fullName(req.getFullName()).studentId(req.getStudentId()).email(req.getEmail())
                .passwordHash(encoder.encode(req.getPassword())).department(req.getDepartment())
                .yearOfStudy(req.getYearOfStudy()).bio(req.getBio()).build();
        user = userRepo.save(user);
        logService.log(user,"USER_REGISTERED","New student: "+user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(tokenProvider.generateToken(user.getEmail()),UserResponse.from(user)));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepo.findByEmailOrStudentId(req.getIdentifier(),req.getIdentifier())
                .orElseThrow(()->new BadCredentialsException("Invalid credentials."));
        if (!user.getIsActive()) throw new BadRequestException("Account suspended. Contact admin@skillswap.com");
        if (!encoder.matches(req.getPassword(),user.getPasswordHash())) throw new BadCredentialsException("Invalid credentials.");
        logService.log(user,"USER_LOGIN","Logged in.");
        return ResponseEntity.ok(new AuthResponse(tokenProvider.generateToken(user.getEmail()),UserResponse.from(user)));
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() { return ResponseEntity.ok().build(); }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserDetails p) {
        User user = userRepo.findByEmail(p.getUsername()).orElseThrow(()->new BadCredentialsException("Not found."));
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
