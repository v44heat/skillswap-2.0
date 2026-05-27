package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data public class LoginRequest {
    @NotBlank private String identifier;
    @NotBlank private String password;
}
