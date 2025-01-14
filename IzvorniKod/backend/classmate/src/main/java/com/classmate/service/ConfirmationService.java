package com.classmate.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.classmate.model.Confirmation;
import com.classmate.repository.ConfirmationRepository;

@Service
public class ConfirmationService {

    @Autowired
    private ConfirmationRepository confirmationRepository;

    public List<Confirmation> getAllConfirmations() {
        return confirmationRepository.findAll();
    }

    public List<Confirmation> getConfirmationsByStudentId(Long studentId) {
        return confirmationRepository.findAll()
                .stream()
                .filter(confirmation -> confirmation.getStudent().getStudentId().equals(studentId))
                .toList();
    }

    public Confirmation createConfirmation(Confirmation confirmation) {
        return confirmationRepository.save(confirmation);
    }

   
    public Confirmation getConfirmationById(Long id) {
        return confirmationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Confirmation not found with ID: " + id));
    }
}
