package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class SkillRequest {
    @NotBlank @Size(max=100) private String skillName;
    @NotBlank                private String category;
    @NotBlank @Size(max=500) private String description;
    @NotBlank                private String proficiency;
    private String availability;
    private Boolean isActive;
}
