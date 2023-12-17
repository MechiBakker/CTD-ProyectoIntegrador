package com.dh.equipo2.roadRunner.service;

import com.dh.equipo2.roadRunner.domain.ConfirmationTokenEmail;
import com.dh.equipo2.roadRunner.repository.ConfirmationTokenEmailRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ConfirmationTokenEmailService {
    private final ConfirmationTokenEmailRepository confirmationTokenEmailRepository;

    public void saveConfirmationTokenEmail(ConfirmationTokenEmail token) {
        confirmationTokenEmailRepository.save(token);
    }

    public Optional<ConfirmationTokenEmail> getConfirmationToken(String token) {
        return confirmationTokenEmailRepository.findByToken(token);
    }

    public int setConfirmedAt(String token) {
        return confirmationTokenEmailRepository.updateConfirmedAt(token, LocalDateTime.now());
    }

}
