package com.classmate.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.classmate.model.Confirmation;
import com.classmate.service.ConfirmationService;

@RestController
@RequestMapping("/api/confirmations")
public class ConfirmationController {

    @Autowired
    private ConfirmationService confirmationService;

    
    @GetMapping
    public List<Confirmation> getAllConfirmations() {
        return confirmationService.getAllConfirmations();
    }

    
    @GetMapping("/student/{studentId}")
    public List<Confirmation> getConfirmationsByStudentId(@PathVariable Long studentId) {
        return confirmationService.getConfirmationsByStudentId(studentId);
    }

    
    @PostMapping
    public ResponseEntity<Confirmation> createConfirmation(@RequestBody Confirmation confirmation) {
        Confirmation createdConfirmation = confirmationService.createConfirmation(confirmation);
        return ResponseEntity.ok(createdConfirmation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Confirmation> getConfirmationById(@PathVariable Long id) {
        Confirmation confirmation = confirmationService.getConfirmationById(id);
        return ResponseEntity.ok(confirmation);
    }
}
