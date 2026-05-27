package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
@Entity @Table(name="feedback") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="session_id",nullable=false) private Session session;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reviewer_id") private User reviewer;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="reviewee_id") private User reviewee;
    @Column(nullable=false) private Integer rating;
    @Column(columnDefinition="TEXT") private String comment;
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
}
