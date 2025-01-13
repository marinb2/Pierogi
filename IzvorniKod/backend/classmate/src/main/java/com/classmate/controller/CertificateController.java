package com.classmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.classmate.model.CertificateRequest;
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
        @PathVariable Long certificateId,
        @RequestParam String studentName, // Dodano ime studenta kao query parametar
        @RequestParam String studentEmail
    ) {

        // Dohvati vrstu potvrde
        CertificateType certificateType = certificateTypeRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate type not found"));



        // Kreiraj request
        certificateService.createCertificateRequest(studentName, studentEmail, certificateType);



        return ResponseEntity.ok("Request created.");
    }


     @GetMapping("/pending-requests")
    public List<CertificateRequest> getPendingRequests() {
        return certificateService.getPendingRequests();
    }


    @PutMapping("/pending-requests/{requestId}/approve")
    public ResponseEntity<String> approveRequest(
    @PathVariable Long requestId,
    @RequestParam String email // Dodan email kao query parametar
    )
    {
    // Dohvati zahtjev i ažuriraj status na APPROVED
    CertificateRequest request = certificateService.updateRequestStatus(requestId, CertificateRequest.Status.APPROVED);

    // Generiraj PDF za studenta
    String pdfPath = certificateService.generatePdf(request.getPersonName(), request.getCertificateType());

    // Pošalji e-mail studentu na navedenu adresu
    certificateService.sendCertificateEmail(pdfPath, email, request.getPersonName());

    return ResponseEntity.ok("Request approved and certificate sent to " + request.getPersonName() + " at " + email);
    }



}
