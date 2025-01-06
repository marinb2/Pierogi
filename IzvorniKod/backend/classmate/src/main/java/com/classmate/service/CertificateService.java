package com.classmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.classmate.model.CertificateType;
import com.classmate.model.Student;
//  import com.classmate.model.EmailService;
import com.classmate.repository.CertificateTypeRepository;
import com.classmate.repository.ConfirmationRepository;
import com.classmate.repository.StudentRepository;



@Service
public class CertificateService {

    @Autowired
    private CertificateTypeRepository certificateTypeRepository;

    @Autowired
    private ConfirmationRepository confirmationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService; // Ako već postoji

    // Dohvati sve dostupne potvrde
    public List<CertificateType> getAvailableCertificates() {
        return certificateTypeRepository.findAll();
    }

    // Generiraj PDF
    public String generatePdf(Student student, CertificateType certificateType) {
        // Logika za generiranje PDF-a pomoću iText-a
        String filePath = "path/to/generated/pdf";
        // Personaliziraj sadržaj (ime, prezime, datum, itd.)
        // Vrati putanju do generiranog PDF-a
        return filePath;
    }

    // Pošalji PDF na email
    public void sendCertificateEmail(String pdfPath, Student student) {
        emailService.sendEmailWithAttachment(
            student.getEmail(),
            "Vaša potvrda",
            "Poštovani " + student.getName() + ", u prilogu se nalazi potvrda.",
            pdfPath
        );
    }
}
