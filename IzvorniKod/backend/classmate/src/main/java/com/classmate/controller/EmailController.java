package com.classmate.controller;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class EmailController {


private final JavaMailSender mailSender;

public EmailController(JavaMailSender mailSender)
{
    this.mailSender = mailSender;
}


@RequestMapping("api/send-email")
public String sendEmail() {
    SimpleMailMessage message = new SimpleMailMessage();

    try{
        message.setFrom("classmatewebapplication@gmail.com");
        message.setTo("classmatewebapplication@gmail.com");
        message.setSubject("Simple Test Email");
        message.setText("This is a sample email body for my first email");
        mailSender.send(message);
        return "Success!";
    } catch(Exception e) {
        return e.getMessage();

    }
    
}





}

