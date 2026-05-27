package com.skillswap.dto.response;
import lombok.*;
import java.util.Map;
@Data @Builder public class AdminStatsResponse {
    private long totalStudents, activeSkills, completedSessions, pendingRequests;
    private Map<String,Long> skillsByCategory;
}
