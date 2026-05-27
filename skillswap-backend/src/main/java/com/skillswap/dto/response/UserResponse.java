package com.skillswap.dto.response;
import com.skillswap.model.User;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder public class UserResponse {
    private Long id;
    private String fullName, studentId, email, department, bio, role, profilePictureUrl;
    private Integer yearOfStudy;
    private Boolean isActive;
    private LocalDateTime createdAt;
    public static UserResponse from(User u) {
        return UserResponse.builder().id(u.getId()).fullName(u.getFullName()).studentId(u.getStudentId())
                .email(u.getEmail()).department(u.getDepartment()).yearOfStudy(u.getYearOfStudy())
                .bio(u.getBio()).role(u.getRole()).isActive(u.getIsActive())
                .profilePictureUrl(u.getProfilePictureUrl()).createdAt(u.getCreatedAt()).build();
    }
}
