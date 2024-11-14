package com.classmate.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.Programme;
import com.classmate.service.ProgrammeService;

@RestController
@RequestMapping("api/programmes")
public class ProgrammeController {

    @Autowired
    private ProgrammeService programmeService;

    @GetMapping
    public List<Programme> getAllProgrammes() {
        return programmeService.getAllProgrammes();
    }

     @GetMapping("/{id}")
    public Optional<Programme> getProgrammeById(@PathVariable Long id) {
        return programmeService.getProgrammeById(id);
    }

     @PostMapping
    public Programme createProgramme(@RequestBody Programme programme) {
        return programmeService.createProgramme(programme);
    }

    @DeleteMapping("/{id}")
    public void deleteProgramme(@PathVariable Long id) {
        programmeService.deleteProgramme(id);
    }




    
}
