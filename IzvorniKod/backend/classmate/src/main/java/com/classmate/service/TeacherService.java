package com.classmate.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.classmate.model.Teacher;
import com.classmate.repository.TeacherRepository;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
}
