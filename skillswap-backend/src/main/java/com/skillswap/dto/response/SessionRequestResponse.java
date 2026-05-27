package com.skillswap.dto.response;
import com.skillswap.model.SessionRequest;
import lombok.*;
import java.time.LocalDate; import java.time.LocalDateTime; import java.time.LocalTime;
@Data @Builder public class SessionRequestResponse {
    private Long id, skillId, requesterId, teacherId;
    private String skillName, requesterName, requesterStudentId, teacherName, message, status;
    private LocalDate preferredDate;
    private LocalTime preferredTime;
    private LocalDateTime createdAt;
    public static SessionRequestResponse from(SessionRequest r) {
        return SessionRequestResponse.builder().id(r.getId()).skillId(r.getSkill().getId())
                .skillName(r.getSkill().getSkillName()).requesterId(r.getRequester().getId())
                .requesterName(r.getRequester().getFullName()).requesterStudentId(r.getRequester().getStudentId())
                .teacherId(r.getSkill().getUser().getId()).teacherName(r.getSkill().getUser().getFullName())
                .preferredDate(r.getPreferredDate()).preferredTime(r.getPreferredTime())
                .message(r.getMessage()).status(r.getStatus()).createdAt(r.getCreatedAt()).build();
    }
}
