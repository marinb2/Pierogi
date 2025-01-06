package com.classmate.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.classmate.model.CertificateType;
import com.classmate.model.Confirmation;
import com.classmate.model.Student;
import com.classmate.repository.CertificateTypeRepository;
import com.classmate.repository.StudentRepository;
import com.classmate.service.CertificateService;
import com.classmate.service.ConfirmationService;



@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CertificateTypeRepository certificateTypeRepository;

    @GetMapping
    public List<CertificateType> getAvailableCertificates() {
        return certificateService.getAvailableCertificates();
    }

    @PostMapping("/{certificateId}/generate")
    public ResponseEntity<String> generateAndSendCertificate(
        @PathVariable Long certificateId, 
        @RequestParam Long studentId
    ) {
        // Dohvati studenta i vrstu potvrde
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        CertificateType certificateType = certificateTypeRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate type not found"));

        // Generiraj PDF
        String pdfPath = certificateService.generatePdf(student, certificateType);

        // Pošalji PDF na email
        certificateService.sendCertificateEmail(pdfPath, student);

        return ResponseEntity.ok("Certificate sent to student");  
    }
}
