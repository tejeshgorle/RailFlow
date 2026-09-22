package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.LoginRequest;
import com.railway.wagonmanagement.dto.LoginResponse;
import com.railway.wagonmanagement.entity.AppUser;
import com.railway.wagonmanagement.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.railway.wagonmanagement.dto.OtpVerifyRequest;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;

    private final PasswordEncoder passwordEncoder;

    private final OtpService otpService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    public LoginResponse login(LoginRequest request) {

        AppUser user =
                appUserRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElse(null);

        if (user == null) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null
            );
        }

        if (!Boolean.TRUE.equals(user.getActive())) {

            return new LoginResponse(
                    false,
                    "User account is inactive",
                    null,
                    null
            );
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()
                );

        if (!passwordMatches) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null
            );
        }

        /*
         * Credentials are valid.
         *
         * Generate OTP.
         */
        String otp =
                otpService.generateOtp(
                        user.getUsername()
                );

        LoginResponse response =
                new LoginResponse(
                        true,
                        "OTP generated",
                        user.getUsername(),
                        user.getRole()
                );

        response.setOtpRequired(true);

        /*
         * TEMPORARY DEVELOPMENT ONLY.
         *
         * In production this will be removed.
         */
        response.setDevelopmentOtp(otp);

        return response;
    }

    public boolean verifyOtp(
        OtpVerifyRequest request
    ) {

        return otpService.verifyOtp(
                request.getUsername(),
                request.getOtp()
        );
    }
}