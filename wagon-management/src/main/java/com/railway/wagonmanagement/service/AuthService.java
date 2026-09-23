package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.LoginRequest;
import com.railway.wagonmanagement.dto.LoginResponse;
import com.railway.wagonmanagement.dto.OtpVerifyRequest;
import com.railway.wagonmanagement.entity.AppUser;
import com.railway.wagonmanagement.repository.AppUserRepository;
import com.railway.wagonmanagement.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;

    private final PasswordEncoder passwordEncoder;

    private final OtpService otpService;

    private final JwtService jwtService;

    private final EmailService emailService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            OtpService otpService,
            JwtService jwtService,
            EmailService emailService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    /*
     * ============================================================
     * LOGIN
     * ============================================================
     *
     * 1. Find user
     * 2. Check account status
     * 3. Validate password
     * 4. Generate OTP
     * 5. Save OTP
     * 6. Send OTP through email
     * 7. Return OTP-required response
     */
    public LoginResponse login(LoginRequest request) {

        AppUser user =
                appUserRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElse(null);

        /*
         * User not found.
         */
        if (user == null) {

            return new LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null
            );
        }

        /*
         * Check whether the account is active.
         */
        if (!Boolean.TRUE.equals(user.getActive())) {

            return new LoginResponse(
                    false,
                    "User account is inactive",
                    null,
                    null
            );
        }

        /*
         * Validate password.
         */
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
         * ========================================================
         * CREDENTIALS ARE VALID
         * ========================================================
         *
         * Generate a new OTP.
         */
        String otp =
                otpService.generateOtp(
                        user.getUsername()
                );

        /*
         * Send OTP to registered email address.
         */
        if (user.getEmail() != null
                && !user.getEmail().isBlank()) {

            emailService.sendOtpEmail(
                    user.getEmail(),
                    otp
            );
        }

        /*
         * Return response indicating that OTP verification
         * is required.
         */
        LoginResponse response =
                new LoginResponse(
                        true,
                        "OTP generated",
                        user.getUsername(),
                        user.getRole()
                );

        response.setOtpRequired(true);

        return response;
    }

    /*
     * ============================================================
     * VERIFY OTP
     * ============================================================
     *
     * 1. Find latest active OTP
     * 2. Check expiry
     * 3. Check OTP value
     * 4. Mark OTP as used
     * 5. Generate JWT
     */
    public LoginResponse verifyOtp(
            OtpVerifyRequest request
    ) {

        boolean verified =
                otpService.verifyOtp(
                        request.getUsername(),
                        request.getOtp()
                );

        /*
         * OTP is invalid or expired.
         */
        if (!verified) {

            return new LoginResponse(
                    false,
                    "Invalid or expired OTP",
                    null,
                    null
            );
        }

        /*
         * Find the user again after successful OTP verification.
         */
        AppUser user =
                appUserRepository
                        .findByUsername(
                                request.getUsername()
                        )
                        .orElse(null);

        if (user == null) {

            return new LoginResponse(
                    false,
                    "User not found",
                    null,
                    null
            );
        }

        /*
         * ========================================================
         * OTP IS VALID
         * ========================================================
         *
         * Generate JWT.
         */
        String token =
                jwtService.generateToken(
                        user.getUsername(),
                        user.getRole()
                );

        LoginResponse response =
                new LoginResponse(
                        true,
                        "OTP verified successfully",
                        user.getUsername(),
                        user.getRole()
                );

        response.setToken(token);

        return response;
    }

    /*
     * ============================================================
     * RESEND OTP
     * ============================================================
     *
     * 1. Find user
     * 2. Check account status
     * 3. Generate new OTP
     * 4. Previous OTP is invalidated by OtpService
     * 5. Send new OTP through email
     * 6. Return OTP-required response
     */
    public LoginResponse resendOtp(String username) {

        AppUser user =
                appUserRepository
                        .findByUsername(username)
                        .orElse(null);

        /*
         * User not found.
         */
        if (user == null) {

            return new LoginResponse(
                    false,
                    "User not found",
                    null,
                    null
            );
        }

        /*
         * Check whether the account is active.
         */
        if (!Boolean.TRUE.equals(user.getActive())) {

            return new LoginResponse(
                    false,
                    "User account is inactive",
                    null,
                    null
            );
        }

        /*
         * ========================================================
         * GENERATE A FRESH OTP
         * ========================================================
         *
         * OtpService also invalidates the previous active OTP.
         */
        String otp =
                otpService.generateOtp(
                        user.getUsername()
                );

        /*
         * Send the new OTP to the registered email.
         */
        if (user.getEmail() != null
                && !user.getEmail().isBlank()) {

            emailService.sendOtpEmail(
                    user.getEmail(),
                    otp
            );
        }

        /*
         * Return response indicating that OTP verification
         * is still required.
         */
        LoginResponse response =
                new LoginResponse(
                        true,
                        "OTP resent successfully",
                        user.getUsername(),
                        user.getRole()
                );

        response.setOtpRequired(true);

        return response;
    }
}