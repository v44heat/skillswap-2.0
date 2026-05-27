package com.skillswap.service;
import com.skillswap.model.*;
import com.skillswap.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository logRepo;
    public void log(User user, String action, String details) {
        logRepo.save(ActivityLog.builder().user(user).action(action).details(details).build());
    }
    public void log(String action, String details) {
        logRepo.save(ActivityLog.builder().action(action).details(details).build());
    }
}
