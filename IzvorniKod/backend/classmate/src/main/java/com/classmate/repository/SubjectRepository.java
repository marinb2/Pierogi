package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
}
