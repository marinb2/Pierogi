package com.classmate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classmate.model.School;
import com.classmate.repository.SchoolRepository;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School createNewSchool(School school) {
        return schoolRepository.save(school);
    }
}
