package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.StudyMaterial;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
}
