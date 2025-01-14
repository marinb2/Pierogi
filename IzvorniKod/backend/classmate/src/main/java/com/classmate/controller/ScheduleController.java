package com.classmate.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.classmate.model.Schedule;
import com.classmate.service.ScheduleService;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
    
    // API za generiranje rasporeda za akademsku godinu
    @PostMapping("/generate")
    public String generateSchedule() {
        scheduleService.generateScheduleForAcademicYear();
        return "Raspored za akademsku godinu je uspješno generiran!";
    }

    // API za dohvat rasporeda prema razredu (npr. 1A)
    @GetMapping("/{gradeNumber}/{gradeLetter}")
    public List<Schedule> getScheduleForClass(@PathVariable Integer gradeNumber, @PathVariable Character gradeLetter) {
        return scheduleService.getScheduleForClass(gradeNumber, gradeLetter);
    }

}
