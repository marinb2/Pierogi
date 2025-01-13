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

    // Pronađi korisnike po školi, programu i razredu
    List<User> findBySchool_SchoolIdAndProgramme_ProgrammeIdAndGradeNumber(Long schoolId, Long programmeId, Integer gradeNumber);

    @Override
    public List<User> findAll();
}
