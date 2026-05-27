package com.skillswap.dto.response;
import com.skillswap.model.Skill;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder public class SkillResponse {
    private Long id, userId;
    private String ownerName, ownerDepartment, skillName, category, description, proficiency, availability;
    private Boolean isActive;
    private LocalDateTime createdAt;
    public static SkillResponse from(Skill s) {
        return SkillResponse.builder().id(s.getId()).userId(s.getUser().getId())
                .ownerName(s.getUser().getFullName()).ownerDepartment(s.getUser().getDepartment())
                .skillName(s.getSkillName()).category(s.getCategory()).description(s.getDescription())
                .proficiency(s.getProficiency()).isActive(s.getIsActive()).availability(s.getAvailability())
                .createdAt(s.getCreatedAt()).build();
    }
}
