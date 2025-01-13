package com.classmate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;

import com.classmate.model.CertificateRequest;
import com.classmate.model.CertificateType;
import com.classmate.model.Student;
import com.classmate.model.User;
import com.classmate.repository.CertificateRequestRepository;
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
    private CertificateRequestRepository certificateRequestRepository;

    @Autowired
    private EmailService emailService;


    public List<CertificateType> getAvailableCertificates() {
        return certificateTypeRepository.findAll();
    }



    public CertificateRequest createCertificateRequest(String personName, String email, CertificateType certificateType) {
        CertificateRequest request = new CertificateRequest();
        request.setPersonName(personName);
        request.setEmail(email);
        request.setCertificateType(certificateType);
        request.setStatus(CertificateRequest.Status.PENDING);
        return certificateRequestRepository.save(request);
    }


    public List<CertificateRequest> getPendingRequests() {
        return certificateRequestRepository.findByStatus(CertificateRequest.Status.PENDING);
    }


    public CertificateRequest updateRequestStatus(Long requestId, CertificateRequest.Status status) {
    CertificateRequest request = certificateRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));
    request.setStatus(status);
    return certificateRequestRepository.save(request);
}


    public String generatePdf(String username, CertificateType certificateType) {
        String filePath = "generated_certificates/" + username + "_" + certificateType.getId() + "_certificate.pdf";

        try {

            File directory = new File("generated_certificates/");
            if (!directory.exists()) {
                directory.mkdirs();
            }


            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();


            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph(certificateType.getName(), titleFont); // Dinamički naslov potvrde
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);


            Font contentFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Paragraph content = new Paragraph(
                "\nOvo je " + certificateType.getName().toLowerCase() + " izdana za studenta imena " + username + ".",
                contentFont
            );
            content.setAlignment(Element.ALIGN_LEFT);
            content.setSpacingAfter(30);
            document.add(content);


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
        String emailBody = "Poštovani " + studentName + ",\n\n" +
                           "Vaša potvrda je odobrena i priložena je u ovom e-mailu.\n\n" +
                           "S poštovanjem,\nVaša škola.";
        emailService.sendEmailWithAttachment(
            email,
            "Odobrena potvrda",
            emailBody,
            pdfPath
        );
    }

}
