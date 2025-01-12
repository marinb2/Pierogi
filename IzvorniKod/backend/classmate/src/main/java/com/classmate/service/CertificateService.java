package com.classmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;
import com.classmate.model.CertificateType;
import com.classmate.model.Student;
import com.classmate.model.User;
//  import com.classmate.model.EmailService;
import com.classmate.repository.CertificateTypeRepository;
import com.classmate.repository.ConfirmationRepository;
import com.classmate.repository.StudentRepository;
import com.classmate.repository.UserRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;




@Service
public class CertificateService {

    @Autowired
    private CertificateTypeRepository certificateTypeRepository;

    @Autowired
    private ConfirmationRepository confirmationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService; // Ako već postoji

    // Dohvati sve dostupne potvrde
    public List<CertificateType> getAvailableCertificates() {
        return certificateTypeRepository.findAll();
    }

   /*  public Student getStudentByUsername(String username) {
        // Dohvati korisnika na temelju username-a
        Optional<User> user = userRepository.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        // Provjeri je li korisnik povezan s entitetom Student
        return studentRepository.findByProgramme(user.getProgramme())
                .orElse(null); // Povezivanje studenta i korisnika putem programa
    }  */

    // Generiraj PDF
    public String generatePdf(String username, CertificateType certificateType) {
        String filePath = "generated_certificates/" + username + "_" + certificateType.getId() + "_certificate.pdf";
    
        try {
            // Provjeri i kreiraj direktorij ako ne postoji
            File directory = new File("generated_certificates/");
            if (!directory.exists()) {
                directory.mkdirs();
            }
    
            // Inicijalizacija PDF dokumenta
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();
    
            // Dodaj naslov
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(certificateType.getName(), titleFont); // Dinamički naslov potvrde
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
    
            // Dodaj sadržaj
            Font contentFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Paragraph content = new Paragraph(
                "\nOvo je " + certificateType.getName().toLowerCase() + " izdana za studenta imena " + username + ".",
                contentFont
            );
            content.setAlignment(Element.ALIGN_LEFT);
            content.setSpacingAfter(30);
            document.add(content);
    
            // Dodaj dodatne informacije
            Paragraph additionalInfo = new Paragraph(
                "Datum izdavanja: " + new java.util.Date(),
                contentFont
            );
            additionalInfo.setAlignment(Element.ALIGN_LEFT);
            document.add(additionalInfo);
    
            document.close();
    
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    
        return filePath;
    }
    

    
    public void sendCertificateEmail(String pdfPath, String email, String studentName) {
        emailService.sendEmailWithAttachment(
            email,
            "Vaša potvrda",
            "Poštovani " + studentName + ", u prilogu se nalazi potvrda.",
            pdfPath
        );
    } 
}
