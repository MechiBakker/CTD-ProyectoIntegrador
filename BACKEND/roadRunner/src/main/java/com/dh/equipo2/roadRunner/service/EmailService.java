package com.dh.equipo2.roadRunner.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void send(String to, String email){
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Confirmación de email para creación de cuenta RoadRunner");
            helper.setFrom("applicationrunner3@gmail.com");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("No se pudo enviar el email", e);
            throw new IllegalStateException("No se pudo enviar el email");
        }
    }


}
