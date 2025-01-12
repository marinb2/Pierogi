package com.classmate.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    // Pronađi prvog učitelja koji nije razrednik
    Optional<Teacher> findFirstByIsClassTeacherFalseOrIsClassTeacherNull();
}
