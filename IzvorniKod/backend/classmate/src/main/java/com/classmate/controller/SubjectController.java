package com.classmate.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.School;
import com.classmate.model.Subject;
import com.classmate.service.SubjectService;

@RestController
@RequestMapping("api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public Optional<Subject> getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }
}
