package com.skillswap.service;
import com.skillswap.dto.request.*;
import com.skillswap.dto.response.*;
import com.skillswap.exception.*;
import com.skillswap.model.User;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepo;
    private final SkillRepository skillRepo;
    private final SessionRequestRepository reqRepo;
    private final SessionRepository sessionRepo;
    private final ActivityLogRepository logRepo;
    private final PasswordEncoder encoder;
    private final NotificationService notifService;
    private final ActivityLogService logService;
    public AdminStatsResponse getStats() {
        long students = userRepo.findByRole("STUDENT").size();
        long active = skillRepo.findAllActiveStudentSkills().size();
        long completed = sessionRepo.countByStatus("COMPLETED");
        long pending = reqRepo.countByStatus("PENDING");
        Map<String,Long> byCat = new LinkedHashMap<>();
        skillRepo.countByCategory().forEach(r->byCat.put((String)r[0],(Long)r[1]));
        return AdminStatsResponse.builder().totalStudents(students).activeSkills(active)
                .completedSessions(completed).pendingRequests(pending).skillsByCategory(byCat).build();
    }
    public List<UserResponse> getUsers(String search) {
        return userRepo.searchStudents(search==null?"":search).stream().map(UserResponse::from).collect(Collectors.toList());
    }
    public UserResponse getUser(Long id) { return UserResponse.from(find(id)); }
    @Transactional
    public UserResponse updateUser(Long id, UpdateProfileRequest req) {
        User u = find(id); u.setFullName(req.getFullName()); u.setDepartment(req.getDepartment());
        u.setYearOfStudy(req.getYearOfStudy()); u.setBio(req.getBio());
        return UserResponse.from(userRepo.save(u));
    }
    @Transactional
    public void deleteUser(Long id, User admin) {
        User u = find(id); userRepo.delete(u);
        logService.log(admin,"ADMIN_DELETE_USER","Deleted: "+u.getFullName());
    }
    @Transactional
    public void resetPassword(Long id, ResetPasswordRequest req, User admin) {
        User u = find(id);
        u.setPasswordHash(encoder.encode(req.getNewPassword()));
        u.setForcePasswordChange(req.getForceChange()!=null&&req.getForceChange());
        userRepo.save(u);
        notifService.send(id,"Password reset","Your password was reset by an administrator.","ADMIN",null);
        logService.log(admin,"ADMIN_RESET_PASSWORD","Reset password for: "+u.getFullName());
    }
    @Transactional
    public UserResponse toggleSuspend(Long id, User admin) {
        User u = find(id); u.setIsActive(!u.getIsActive()); userRepo.save(u);
        logService.log(admin,u.getIsActive()?"ADMIN_ACTIVATE_USER":"ADMIN_SUSPEND_USER","User: "+u.getFullName());
        if (!u.getIsActive()) notifService.send(id,"Account suspended","Your account has been suspended. Contact admin@skillswap.com","ADMIN",null);
        return UserResponse.from(u);
    }
    public List<ActivityLogResponse> getLogs(Long userId, String action) {
        return logRepo.findFiltered(userId, action==null?"":action).stream().map(ActivityLogResponse::from).collect(Collectors.toList());
    }
    private User find(Long id) { return userRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("User",id)); }
}
