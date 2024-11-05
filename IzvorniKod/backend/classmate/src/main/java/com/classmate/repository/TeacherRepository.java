package com.classmate.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.classmate.model.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
