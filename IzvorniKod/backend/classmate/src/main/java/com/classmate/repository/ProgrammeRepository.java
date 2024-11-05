package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Programme;

public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
}
