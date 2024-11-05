package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
