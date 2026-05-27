package com.skillswap.dto.response;
import com.skillswap.model.ActivityLog;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder public class ActivityLogResponse {
    private Long id, userId;
    private String userName, action, details, ipAddress;
    private LocalDateTime createdAt;
    public static ActivityLogResponse from(ActivityLog a) {
        return ActivityLogResponse.builder().id(a.getId())
                .userId(a.getUser()!=null?a.getUser().getId():null)
                .userName(a.getUser()!=null?a.getUser().getFullName():"System")
                .action(a.getAction()).details(a.getDetails()).ipAddress(a.getIpAddress())
                .createdAt(a.getCreatedAt()).build();
    }
}
