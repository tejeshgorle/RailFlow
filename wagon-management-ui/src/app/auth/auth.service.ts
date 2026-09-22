import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username: string | null;
  role: string | null;
  otpRequired: boolean;
  developmentOtp: string | null;
}

export interface OtpVerifyRequest {
  username: string;
  otp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    const request: LoginRequest = {
      username,
      password
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  verifyOtp(
    username: string,
    otp: string
  ): Observable<LoginResponse> {

    const request: OtpVerifyRequest = {
      username,
      otp
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/verify-otp`,
      request
    );
  }
}