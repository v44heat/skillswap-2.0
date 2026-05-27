package com.skillswap.dto.response;
import com.skillswap.model.Notification;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder public class NotificationResponse {
    private Long id, relatedId;
    private String title, message, type;
    private Boolean isRead;
    private LocalDateTime createdAt;
    public static NotificationResponse from(Notification n) {
        return NotificationResponse.builder().id(n.getId()).title(n.getTitle()).message(n.getMessage())
                .type(n.getType()).relatedId(n.getRelatedId()).isRead(n.getIsRead()).createdAt(n.getCreatedAt()).build();
    }
}
