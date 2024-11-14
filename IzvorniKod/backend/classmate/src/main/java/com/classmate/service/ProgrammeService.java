package com.classmate.service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Programme> getProgrammeById(Long id) {
        return programmeRepository.findById(id);
    }

    public Programme createProgramme(Programme programme) {
        return programmeRepository.save(programme);
    }

    public boolean deleteProgramme(Long id) {
        if (programmeRepository.existsById(id)) {
            programmeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    
}
