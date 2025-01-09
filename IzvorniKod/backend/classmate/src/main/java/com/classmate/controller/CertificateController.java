package com.classmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.classmate.model.CertificateType;
import com.classmate.model.Student;
import com.classmate.repository.CertificateTypeRepository;
import com.classmate.repository.StudentRepository;
import com.classmate.service.CertificateService;

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
        @PathVariable Long certificateId
       
    ) {
        // Dohvati trenutno prijavljenog korisnika
       // String username = authentication.getName();

        // Provjeri je li korisnik student i dohvatite studenta
      /*  Student student = certificateService.getStudentByUsername(username);

        if (student == null) {
            return ResponseEntity.status(403).body("Only students can generate certificates.");
        }  */

        // Dohvati vrstu potvrde
        CertificateType certificateType = certificateTypeRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate type not found"));

        //Generiraj PDF
        String pdfPath = certificateService.generatePdf("LovreJelicic", certificateType);

        // Pošalji PDF na email
     //   certificateService.sendCertificateEmail(pdfPath, student);

        return ResponseEntity.ok("Certificate sent to student.");
    }
}
