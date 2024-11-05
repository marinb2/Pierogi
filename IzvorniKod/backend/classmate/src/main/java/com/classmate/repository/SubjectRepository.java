package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
