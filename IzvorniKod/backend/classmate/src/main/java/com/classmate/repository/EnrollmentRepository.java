package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
}
