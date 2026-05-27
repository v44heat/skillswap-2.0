package com.skillswap.dto.response;
import com.skillswap.model.Session;
import lombok.*;
import java.time.LocalDate; import java.time.LocalDateTime; import java.time.LocalTime;
@Data @Builder public class SessionResponse {
    private Long id, skillId, teacherId, learnerId;
    private String skillName, teacherName, learnerName, location, status, notes;
    private LocalDate sessionDate;
    private LocalTime startTime, endTime;
    private Boolean hasRated;
    private LocalDateTime createdAt;
    public static SessionResponse from(Session s, boolean hasRated) {
        return SessionResponse.builder().id(s.getId()).skillId(s.getSkill().getId())
                .skillName(s.getSkill().getSkillName()).teacherId(s.getTeacher().getId())
                .teacherName(s.getTeacher().getFullName()).learnerId(s.getLearner().getId())
                .learnerName(s.getLearner().getFullName()).sessionDate(s.getSessionDate())
                .startTime(s.getStartTime()).endTime(s.getEndTime()).location(s.getLocation())
                .status(s.getStatus()).notes(s.getNotes()).hasRated(hasRated).createdAt(s.getCreatedAt()).build();
    }
}
