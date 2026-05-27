package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
@Entity @Table(name="activity_logs") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityLog {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id") private User user;
    @Column(nullable=false,length=100) private String action;
    @Column(columnDefinition="TEXT") private String details;
    @Column(name="ip_address",length=45) private String ipAddress;
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
}
