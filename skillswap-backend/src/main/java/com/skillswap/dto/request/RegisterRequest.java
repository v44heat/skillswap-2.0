package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class RegisterRequest {
    @NotBlank @Size(max=100) private String fullName;
    @NotBlank @Size(max=20)  private String studentId;
    @NotBlank @Email         private String email;
    private String department;
    private Integer yearOfStudy;
    @NotBlank @Size(min=6)   private String password;
    private String bio;
}
