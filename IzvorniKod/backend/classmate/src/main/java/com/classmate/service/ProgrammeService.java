package com.classmate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.classmate.model.Programme;
import com.classmate.repository.ProgrammeRepository;

@Service
public class ProgrammeService {

    @Autowired
    private ProgrammeRepository programmeRepository;

    public List<Programme> getAllProgrammes() {
        return programmeRepository.findAll();
    }

}
