package com.classmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.School;
import com.classmate.service.SchoolService;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    @GetMapping("")
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    

    @PostMapping(value = "", consumes = { "application/json" })
    public School createSchool(@RequestBody School school) {
        return schoolService.createNewSchool(school);
    }
}
