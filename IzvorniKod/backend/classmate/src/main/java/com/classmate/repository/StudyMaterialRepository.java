package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.classmate.model.StudyMaterial;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
}
