package com.classmate.controller;

import java.lang.StackWalker.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.Programme;
import com.classmate.model.Schedule;
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

    
}
