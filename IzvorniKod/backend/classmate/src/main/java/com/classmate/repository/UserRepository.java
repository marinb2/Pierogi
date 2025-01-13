package com.classmate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.classmate.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional <User> findByUsername(String username);

    @Query("SELECT u from User u WHERE u.email = ?1")
    List<User> findByEmail(String email);

    // Pronađi korisnike prema razredniku, broju razreda i slovu razreda
    List<User> findByClassTeacherIdAndGradeNumberAndGradeLetter(Long classTeacherId, Integer gradeNumber, Character gradeLetter);

    // Pronađi sve učenike u određenom razredu i slovu razreda
    List<User> findByGradeNumberAndGradeLetter(Integer gradeNumber, Character gradeLetter);

    @Override
    public List<User> findAll();
}
