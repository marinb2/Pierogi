package com.classmate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    // Pronađi sve profesore koji su razrednici
    List<Teacher> findByIsClassTeacherTrue();

    // Pronađi prvog profesora koji nije razrednik ili mu nije postavljena vrijednost
    Optional<Teacher> findFirstByIsClassTeacherFalseOrIsClassTeacherNull();
}
