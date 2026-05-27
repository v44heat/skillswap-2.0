package com.skillswap.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
@Entity @Table(name="skills") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Column(name="skill_name",nullable=false,length=100) private String skillName;
    @Column(nullable=false,length=50) private String category;
    @Column(columnDefinition="TEXT") private String description;
    @Column(name="proficiency_level",length=20) private String proficiency;
    @Column(name="is_active") @Builder.Default private Boolean isActive=true;
    @Column(columnDefinition="TEXT") private String availability;
    @CreationTimestamp @Column(name="created_at",updatable=false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt;
}
