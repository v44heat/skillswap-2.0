package com.skillswap.repository;
import com.skillswap.model.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStudentId(String studentId);
    Optional<User> findByEmailOrStudentId(String email, String studentId);
    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);
    List<User> findByRole(String role);
    @Query("SELECT u FROM User u WHERE u.role='STUDENT' AND (:s='' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:s,'%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%',:s,'%')) OR LOWER(u.studentId) LIKE LOWER(CONCAT('%',:s,'%'))) ORDER BY u.createdAt DESC")
    List<User> searchStudents(@Param("s") String s);
}
