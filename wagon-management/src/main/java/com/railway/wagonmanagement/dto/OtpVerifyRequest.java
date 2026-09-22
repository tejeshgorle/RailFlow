package com.railway.wagonmanagement.dto;

public class OtpVerifyRequest {

    private String username;
    private String otp;

    public OtpVerifyRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}