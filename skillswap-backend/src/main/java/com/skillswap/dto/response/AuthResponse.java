package com.skillswap.dto.response;
import lombok.*;
@Data @AllArgsConstructor public class AuthResponse {
    private String token;
    private UserResponse user;
}
