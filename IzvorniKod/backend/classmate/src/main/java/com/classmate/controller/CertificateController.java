package com.classmate.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.classmate.model.CertificateRequest;
import com.classmate.model.CertificateType;
import com.classmate.model.User;
import com.classmate.repository.CertificateTypeRepository;
import com.classmate.repository.UserRepository;
import com.classmate.service.CertificateService;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;


    @Autowired
    private UserRepository userRepository;

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
            @RequestParam String studentEmail) {

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

    @GetMapping("/statistics/total-requests")
    public ResponseEntity<Long> getTotalCertificateRequests() {
        long totalRequests = certificateService.getTotalCertificateRequests();
        return ResponseEntity.ok(totalRequests);
    }

    @GetMapping("/statistics/pending-requests")
    public ResponseEntity<Long> getPendingCertificateRequests() {
        long pendingRequests = certificateService.getPendingCertificateRequests();
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("/statistics/approved-requests")
    public ResponseEntity<Long> getApprovedCertificateRequests() {
        long approvedRequests = certificateService.getApprovedCertificateRequests();
        return ResponseEntity.ok(approvedRequests);
    }

    @PutMapping("/pending-requests/{requestId}/approve")
    public ResponseEntity<String> approveRequest(
            @PathVariable Long requestId,
            @RequestParam String email // Dodan email kao query parametar
    ) {
        // Dohvati zahtjev i ažuriraj status na APPROVED
        CertificateRequest request = certificateService.updateRequestStatus(requestId,
                CertificateRequest.Status.APPROVED);

        // Generiraj PDF za studenta
        String pdfPath = certificateService.generatePdf(request.getPersonName(), request.getCertificateType());

        // Pošalji e-mail studentu na navedenu adresu
        certificateService.sendCertificateEmail(pdfPath, email, request.getPersonName());

        return ResponseEntity
                .ok("Request approved and certificate sent to " + request.getPersonName() + " at " + email);
    }

    @GetMapping("/getAllBySchoolId")
    public List<CertificateRequest> getAllBySchoolId(@RequestParam Long id) {
        List<CertificateRequest> all_certificates = certificateService.getPendingRequests();
        List<CertificateRequest> all_approved = certificateService.getApprovedRequests();
        List<CertificateRequest> return_this = new ArrayList<>();

        List<User> all_users = userRepository.findAll();
        List<User> relevant_users = new ArrayList<>();

        all_certificates.addAll(all_approved);

        for (int i = 0; i < all_users.size(); i++) {
            if (all_users.get(i).getSchool() != null)
                if (all_users.get(i).getSchool().getSchoolId() == id) {
                    relevant_users.add(all_users.get(i));
                }
        }

        for(int i = 0; i < relevant_users.size(); i++){
            for(int j = 0; j < all_certificates.size(); j++){
                if(relevant_users.get(i).getEmail().equals(all_certificates.get(j).getEmail())){
                    return_this.add(all_certificates.get(j));
                }
            }
        }

        return return_this;
    }

}
