package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.Programme;

@Repository
public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
}
