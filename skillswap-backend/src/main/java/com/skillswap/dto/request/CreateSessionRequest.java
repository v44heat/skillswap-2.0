package com.skillswap.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data public class CreateSessionRequest {
    @NotNull private Long skillId;
    @NotNull private LocalDate preferredDate;
    @NotNull private LocalTime preferredTime;
    private String message;
}
