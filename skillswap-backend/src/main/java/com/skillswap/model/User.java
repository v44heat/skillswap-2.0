package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="full_name",nullable=false,length=100) private String fullName;
    @Column(name="student_id",nullable=false,unique=true,length=20) private String studentId;
    @Column(nullable=false,unique=true,length=100) private String email;
    @Column(name="password_hash",nullable=false) private String passwordHash;
    @Column(length=100) private String department;
    @Column(name="year_of_study") private Integer yearOfStudy;
    @Column(columnDefinition="TEXT") private String bio;
    @Column(name="profile_picture_url") private String profilePictureUrl;
    @Column(nullable=false,length=20) @Builder.Default private String role="STUDENT";
    @Column(name="is_active",nullable=false) @Builder.Default private Boolean isActive=true;
    @Column(name="force_password_change") @Builder.Default private Boolean forcePasswordChange=false;
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt;
}
