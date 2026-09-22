package com.railway.wagonmanagement.controller;

import com.railway.wagonmanagement.dto.LoginRequest;
import com.railway.wagonmanagement.dto.LoginResponse;
import com.railway.wagonmanagement.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.railway.wagonmanagement.dto.OtpVerifyRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                authService.login(request);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .status(401)
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(
            @RequestBody OtpVerifyRequest request
    ) {

        boolean verified =
                authService.verifyOtp(request);

        if (!verified) {

            return ResponseEntity
                    .status(401)
                    .body(
                            new LoginResponse(
                                    false,
                                    "Invalid or expired OTP",
                                    null,
                                    null
                            )
                    );
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        true,
                        "OTP verified successfully",
                        request.getUsername(),
                        null
                )
        );
    }
}