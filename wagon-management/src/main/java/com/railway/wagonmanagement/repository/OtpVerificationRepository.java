package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification>
    findTopByUsernameAndVerifiedFalseOrderByCreatedAtDesc(
            String username
    );
}