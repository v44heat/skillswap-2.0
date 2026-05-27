package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate; import java.time.LocalDateTime; import java.time.LocalTime;
@Entity @Table(name="session_requests") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SessionRequest {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="skill_id",nullable=false) private Skill skill;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="requester_id",nullable=false) private User requester;
    @Column(name="preferred_date",nullable=false) private LocalDate preferredDate;
    @Column(name="preferred_time",nullable=false) private LocalTime preferredTime;
    @Column(columnDefinition="TEXT") private String message;
    @Column(nullable=false,length=20) @Builder.Default private String status="PENDING";
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt;
}
