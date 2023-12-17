package com.dh.equipo2.roadRunner.repository;

import com.dh.equipo2.roadRunner.domain.ConfirmationTokenEmail;
import com.dh.equipo2.roadRunner.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface ConfirmationTokenEmailRepository extends JpaRepository<ConfirmationTokenEmail, Long> {

    Optional<ConfirmationTokenEmail> findByToken(String token);

    @Transactional
    @Modifying
    @Query("UPDATE ConfirmationTokenEmail c " +
            "SET c.confirmedAt = ?2 " +
            "WHERE c.token = ?1")
    int updateConfirmedAt(String token, LocalDateTime confirmedAt);

    @Modifying
    @Transactional
    void deleteByUser(User user);

    @Modifying
    @Transactional
    void deleteByToken(String token);

}
