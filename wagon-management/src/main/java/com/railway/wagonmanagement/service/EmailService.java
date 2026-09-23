package com.railway.wagonmanagement.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(
            JavaMailSender mailSender
    ) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(
            String recipientEmail,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(recipientEmail);

        message.setSubject(
                "RailFlow Login OTP"
        );

        message.setText(
                "Dear RailFlow User,\n\n"
                + "Your OTP for RailFlow login is: "
                + otp
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "Regards,\n"
                + "RailFlow\n"
                + "Rail Freight Operations"
        );

        mailSender.send(message);
    }
}