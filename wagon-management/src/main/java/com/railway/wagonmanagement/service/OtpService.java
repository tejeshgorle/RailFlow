package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.entity.OtpVerification;
import com.railway.wagonmanagement.repository.OtpVerificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepository;

    private final Random random = new Random();

    public OtpService(
            OtpVerificationRepository otpRepository
    ) {
        this.otpRepository = otpRepository;
    }

    public String generateOtp(String username) {

        /*
         * Generate a 6-digit OTP.
         */
        String otp = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        OtpVerification verification =
                new OtpVerification();

        verification.setUsername(username);
        verification.setOtp(otp);

        verification.setExpiresAt(
                LocalDateTime.now().plusSeconds(60)
        );

        verification.setVerified(false);

        otpRepository.save(verification);

        return otp;
    }

    public boolean verifyOtp(
            String username,
            String otp
    ) {

        OtpVerification verification =
                otpRepository
                        .findTopByUsernameAndVerifiedFalseOrderByCreatedAtDesc(
                                username
                        )
                        .orElse(null);

        if (verification == null) {
            return false;
        }

        /*
         * Check expiration.
         */
        if (
                LocalDateTime.now()
                        .isAfter(verification.getExpiresAt())
        ) {

            return false;
        }

        /*
         * Check OTP value.
         */
        if (!verification.getOtp().equals(otp)) {
            return false;
        }

        /*
         * Mark OTP as used.
         */
        verification.setVerified(true);

        otpRepository.save(verification);

        return true;
    }
}