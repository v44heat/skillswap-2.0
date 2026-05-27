package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class UpdateProfileRequest {
    @NotBlank @Size(max=100) private String fullName;
    private String department;
    private Integer yearOfStudy;
    private String bio;
}
