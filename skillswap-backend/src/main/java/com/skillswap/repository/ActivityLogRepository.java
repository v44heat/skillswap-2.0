package com.skillswap.repository;
import com.skillswap.model.ActivityLog;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog,Long> {

    @Query("SELECT a FROM ActivityLog a LEFT JOIN FETCH a.user WHERE (:uid IS NULL OR a.user.id = :uid) AND (:action = '' OR a.action = :action) ORDER BY a.createdAt DESC")
    List<ActivityLog> findFiltered(@Param("uid") Long uid, @Param("action") String action);

    @Query("SELECT a FROM ActivityLog a LEFT JOIN FETCH a.user ORDER BY a.createdAt DESC")
    List<ActivityLog> findTop50ByOrderByCreatedAtDesc();
}
