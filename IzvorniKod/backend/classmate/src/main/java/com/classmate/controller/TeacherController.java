package com.classmate.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.Teacher;
import com.classmate.service.TeacherService;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    // API za dohvat svih profesora
    @GetMapping("/all")
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }
}
