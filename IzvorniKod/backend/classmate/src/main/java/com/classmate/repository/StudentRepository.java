package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
