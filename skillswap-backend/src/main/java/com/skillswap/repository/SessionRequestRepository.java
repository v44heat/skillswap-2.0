package com.skillswap.repository;
import com.skillswap.model.SessionRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface SessionRequestRepository extends JpaRepository<SessionRequest,Long> {

    @Query("SELECT r FROM SessionRequest r JOIN FETCH r.skill s JOIN FETCH s.user JOIN FETCH r.requester WHERE r.requester.id = :requesterId ORDER BY r.createdAt DESC")
    List<SessionRequest> findByRequesterIdOrderByCreatedAtDesc(@Param("requesterId") Long requesterId);

    @Query("SELECT r FROM SessionRequest r JOIN FETCH r.skill s JOIN FETCH s.user JOIN FETCH r.requester WHERE s.user.id = :ownerId ORDER BY r.createdAt DESC")
    List<SessionRequest> findReceivedByOwner(@Param("ownerId") Long ownerId);

    @Query("SELECT r FROM SessionRequest r JOIN FETCH r.skill s JOIN FETCH s.user JOIN FETCH r.requester WHERE (:status = '' OR r.status = :status) ORDER BY r.createdAt DESC")
    List<SessionRequest> findAllFiltered(@Param("status") String status);

    long countByStatus(String status);
}
