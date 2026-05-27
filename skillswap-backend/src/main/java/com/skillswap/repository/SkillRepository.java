package com.skillswap.repository;
import com.skillswap.model.Skill;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface SkillRepository extends JpaRepository<Skill,Long> {

    @Query("SELECT s FROM Skill s JOIN FETCH s.user WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<Skill> findByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Skill s JOIN FETCH s.user WHERE s.user.id <> :uid AND s.isActive = true AND s.user.isActive = true AND s.user.role = 'STUDENT' AND (:search = '' OR LOWER(s.skillName) LIKE LOWER(CONCAT('%',:search,'%'))) AND (:cat = '' OR s.category = :cat) AND (:prof = '' OR s.proficiency = :prof) ORDER BY s.createdAt DESC")
    List<Skill> browseSkills(@Param("uid") Long uid, @Param("search") String search, @Param("cat") String cat, @Param("prof") String prof);

    @Query("SELECT s FROM Skill s JOIN FETCH s.user WHERE s.isActive = true AND s.user.role = 'STUDENT'")
    List<Skill> findAllActiveStudentSkills();

    @Query("SELECT s FROM Skill s JOIN FETCH s.user WHERE (:search = '' OR LOWER(s.skillName) LIKE LOWER(CONCAT('%',:search,'%'))) AND (:cat = '' OR s.category = :cat) ORDER BY s.createdAt DESC")
    List<Skill> adminSearch(@Param("search") String search, @Param("cat") String cat);

    @Query("SELECT s.category, COUNT(s) FROM Skill s WHERE s.isActive = true GROUP BY s.category")
    List<Object[]> countByCategory();
}
