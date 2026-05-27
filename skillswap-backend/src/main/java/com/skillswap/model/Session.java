package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate; import java.time.LocalDateTime; import java.time.LocalTime;
@Entity @Table(name="sessions") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Session {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="request_id") private SessionRequest request;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="skill_id",nullable=false) private Skill skill;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="teacher_id",nullable=false) private User teacher;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="learner_id",nullable=false) private User learner;
    @Column(name="session_date",nullable=false) private LocalDate sessionDate;
    @Column(name="start_time",nullable=false) private LocalTime startTime;
    @Column(name="end_time") private LocalTime endTime;
    @Column(length=200) private String location;
    @Column(nullable=false,length=20) @Builder.Default private String status="CONFIRMED";
    @Column(columnDefinition="TEXT") private String notes;
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt;
}
