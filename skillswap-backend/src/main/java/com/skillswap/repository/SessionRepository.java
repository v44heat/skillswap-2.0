package com.skillswap.repository;
import com.skillswap.model.Session;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {

    @Query("SELECT s FROM Session s JOIN FETCH s.skill JOIN FETCH s.teacher JOIN FETCH s.learner WHERE (s.teacher.id = :uid OR s.learner.id = :uid) AND s.status = 'CONFIRMED' AND s.sessionDate >= :today ORDER BY s.sessionDate ASC, s.startTime ASC")
    List<Session> findUpcoming(@Param("uid") Long uid, @Param("today") LocalDate today);

    @Query("SELECT s FROM Session s JOIN FETCH s.skill JOIN FETCH s.teacher JOIN FETCH s.learner WHERE (s.teacher.id = :uid OR s.learner.id = :uid) AND (s.status = 'COMPLETED' OR s.status = 'CANCELLED' OR (s.status = 'CONFIRMED' AND s.sessionDate < :today)) ORDER BY s.sessionDate DESC")
    List<Session> findPast(@Param("uid") Long uid, @Param("today") LocalDate today);

    @Query("SELECT s FROM Session s JOIN FETCH s.skill JOIN FETCH s.teacher JOIN FETCH s.learner WHERE (:status = '' OR s.status = :status) ORDER BY s.sessionDate DESC")
    List<Session> findAllFiltered(@Param("status") String status);

    @Override
    @Query("SELECT s FROM Session s JOIN FETCH s.skill JOIN FETCH s.teacher JOIN FETCH s.learner WHERE s.id = :id")
    Optional<Session> findById(@Param("id") Long id);

    long countByStatus(String status);
}
