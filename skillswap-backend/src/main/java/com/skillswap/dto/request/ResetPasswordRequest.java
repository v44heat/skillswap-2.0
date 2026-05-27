package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class ResetPasswordRequest {
    @NotBlank @Size(min=6) private String newPassword;
    private Boolean forceChange = true;
}
