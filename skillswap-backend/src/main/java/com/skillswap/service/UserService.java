package com.skillswap.service;
import com.skillswap.dto.request.*;
import com.skillswap.dto.response.UserResponse;
import com.skillswap.exception.*;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    public UserResponse getProfile(Long uid) { return UserResponse.from(find(uid)); }
    public UserResponse getById(Long id) { return UserResponse.from(find(id)); }
    @Transactional
    public UserResponse updateProfile(Long uid, UpdateProfileRequest req) {
        User u = find(uid);
        u.setFullName(req.getFullName()); u.setDepartment(req.getDepartment());
        u.setYearOfStudy(req.getYearOfStudy()); u.setBio(req.getBio());
        return UserResponse.from(userRepo.save(u));
    }
    @Transactional
    public void changePassword(Long uid, ChangePasswordRequest req) {
        User u = find(uid);
        if (!encoder.matches(req.getCurrentPassword(),u.getPasswordHash()))
            throw new BadRequestException("Current password is incorrect.");
        if (req.getConfirmPassword()!=null && !req.getNewPassword().equals(req.getConfirmPassword()))
            throw new BadRequestException("New passwords do not match.");
        u.setPasswordHash(encoder.encode(req.getNewPassword()));
        u.setForcePasswordChange(false);
        userRepo.save(u);
    }
    private User find(Long id) { return userRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("User",id)); }
}
