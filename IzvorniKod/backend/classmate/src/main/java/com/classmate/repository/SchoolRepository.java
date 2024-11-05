package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.School;

public interface SchoolRepository extends JpaRepository<School, Long> {
}
