import { Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { AuthService, LoginResponse } from '../auth.service';
import {
  LucideEye,
  LucideEyeOff,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideCircleAlert,
  LucideArrowLeft
} from '@lucide/angular';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    FormsModule,
    NgIf,

    LucideEye,
    LucideEyeOff,
    LucideRefreshCw,
    LucideShieldCheck,
    LucideCircleAlert,
    LucideArrowLeft
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnDestroy {

  // =====================================================
  // CREDENTIALS
  // =====================================================

  username = '';
  password = '';
  captchaInput = '';

  // =====================================================
  // UI STATE
  // =====================================================

  showPassword = false;
  isLoading = false;

  usernameTouched = false;
  passwordTouched = false;
  captchaTouched = false;

  captchaError = false;
  loginError = '';

  // =====================================================
  // OTP STATE
  // =====================================================

  otpMode = false;
  otpInput = '';

  otpTouched = false;
  otpError = '';

  otpSecondsRemaining = 60;
  otpResendAvailable = false;


  private otpTimer?: Subscription;

  // =====================================================
  // CAPTCHA
  // =====================================================

  captcha = this.generateCaptcha();

  constructor(
  private router: Router,
  private authService: AuthService
) {}

  private generateCaptcha(): string {

    return Math.floor(
      10000 + Math.random() * 90000
    ).toString();

  }

  refreshCaptcha(): void {

    this.captcha = this.generateCaptcha();

    this.captchaInput = '';

    this.captchaTouched = false;

    this.captchaError = false;

    this.loginError = '';

  }

  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  // =====================================================
  // CREDENTIAL VALIDATION
  // =====================================================

  get usernameInvalid(): boolean {

    return this.usernameTouched &&
      !this.username.trim();

  }

  get passwordInvalid(): boolean {

    return this.passwordTouched &&
      !this.password;

  }

  get captchaInvalid(): boolean {

    return this.captchaTouched &&
      (
        !this.captchaInput.trim() ||
        this.captchaError
      );

  }

  get formValid(): boolean {

    return (
      !!this.username.trim() &&
      !!this.password &&
      !!this.captchaInput.trim() &&
      this.captchaInput === this.captcha
    );

  }

  // =====================================================
  // CREDENTIAL FIELD EVENTS
  // =====================================================

  onUsernameBlur(): void {

    this.usernameTouched = true;

  }

  onPasswordBlur(): void {

    this.passwordTouched = true;

  }

  onCaptchaBlur(): void {

    this.captchaTouched = true;

    if (
      this.captchaInput &&
      this.captchaInput !== this.captcha
    ) {

      this.captchaError = true;

    }

  }

  onCaptchaInput(): void {

    this.captchaError = false;
    this.loginError = '';

    if (
      this.captchaInput.length === 5 &&
      this.captchaInput !== this.captcha
    ) {

      this.captchaError = true;

    }

  }

  // =====================================================
  // SIGN IN → OTP
  // =====================================================

  signIn(): void {

  if (this.isLoading) {
    return;
  }

  console.log('========== LOGIN START ==========');
  console.log('Username:', this.username);

  this.usernameTouched = true;
  this.passwordTouched = true;
  this.captchaTouched = true;

  this.loginError = '';

  if (
    !this.username.trim() ||
    !this.password ||
    !this.captchaInput.trim()
  ) {
    console.log('❌ Frontend validation failed');
    return;
  }

  if (this.captchaInput !== this.captcha) {

    console.log('❌ CAPTCHA validation failed');

    this.captchaError = true;

    this.loginError =
      'The verification code is incorrect. Please try again.';

    return;
  }

  console.log('✅ Frontend validation passed');

  this.isLoading = true;

  console.log(
    '➡️ Sending request to backend:',
    'http://localhost:8080/api/auth/login'
  );

  const startTime = Date.now();

  this.authService
    .login(
      this.username.trim(),
      this.password
    )
    .subscribe({

      next: (response: LoginResponse) => {

        const elapsed =
          Date.now() - startTime;

        console.log(
          `✅ Backend response received after ${elapsed} ms`
        );

        console.log(
          'Backend response:',
          response
        );

        this.isLoading = false;

        if (!response.success) {

          this.loginError =
            response.message ||
            'Invalid username or password.';

          return;
        }

        if (response.otpRequired) {

          console.log(
            '🔐 OTP required'
          );

          console.log(
            'Development OTP:',
            response.developmentOtp
          );

          this.otpMode = true;

          this.otpInput = '';
          this.otpTouched = false;
          this.otpError = '';

          this.startOtpTimer();

          console.log(
            '✅ OTP screen should now be visible'
          );

          return;
        }

        this.loginError =
          'Authentication response was invalid.';
      },

      error: (error) => {

        const elapsed =
          Date.now() - startTime;

        console.error(
          `❌ Login request failed after ${elapsed} ms`
        );

        console.error(
          'HTTP error:',
          error
        );

        this.isLoading = false;

        if (error.status === 401) {

          this.loginError =
            error.error?.message ||
            'Invalid username or password.';

        } else {

          this.loginError =
            'Unable to connect to the authentication server.';
        }
      }
    });
}
  // =====================================================
  // OTP VALIDATION
  // =====================================================

  get otpValid(): boolean {

    return /^\d{6}$/.test(this.otpInput);

  }

  get otpInvalid(): boolean {

    return this.otpTouched &&
      (
        this.otpInput.length !== 6 ||
        !!this.otpError
      );

  }

  onOtpInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.otpInput = input.value
      .replace(/\D/g, '')
      .slice(0, 6);

    this.otpError = '';

  }

  onOtpBlur(): void {

    this.otpTouched = true;

  }

  // =====================================================
  // OTP TIMER
  // =====================================================

  startOtpTimer(): void {

    this.stopOtpTimer();

    this.otpSecondsRemaining = 60;

    this.otpResendAvailable = false;

    this.otpTimer = interval(1000).subscribe(() => {

      if (this.otpSecondsRemaining <= 1) {

        this.otpSecondsRemaining = 0;

        this.otpResendAvailable = true;

        this.stopOtpTimer();

        return;

      }

      this.otpSecondsRemaining--;

    });

  }

  stopOtpTimer(): void {

    this.otpTimer?.unsubscribe();

    this.otpTimer = undefined;

  }

  // =====================================================
  // RESEND OTP
  // =====================================================

  resendOtp(): void {

    if (!this.otpResendAvailable) {
      return;
    }

    this.otpInput = '';

    this.otpTouched = false;

    this.otpError = '';

    /*
     * TEMPORARY DEVELOPMENT FLOW
     *
     * Later:
     * POST /api/auth/resend-otp
     */

    this.startOtpTimer();

  }

  // =====================================================
  // BACK TO CREDENTIALS
  // =====================================================

  backToCredentials(): void {

    this.stopOtpTimer();

    this.otpMode = false;

    this.otpInput = '';

    this.otpTouched = false;

    this.otpError = '';

  }

  // =====================================================
  // VERIFY OTP
  // =====================================================

  verifyOtp(): void {

    if (this.isLoading) {
      return;
    }

    this.otpTouched = true;
    this.otpError = '';

    if (!this.otpValid) {
      return;
    }

    this.isLoading = true;

    this.authService
      .verifyOtp(
        this.username.trim(),
        this.otpInput
      )
      .subscribe({

        next: (response: LoginResponse) => {

          this.isLoading = false;

          if (!response.success) {

            this.otpError =
              response.message ||
              'Invalid or expired OTP.';

            return;
          }

          this.stopOtpTimer();

          console.log(
            'OTP verification successful'
          );

          this.router.navigate([
            '/dashboard'
          ]);
        },

        error: (error) => {

          this.isLoading = false;

          console.error(
            'OTP verification error:',
            error
          );

          this.otpError =
            error.error?.message ||
            'Invalid or expired OTP.';
        }
      });
  }
  // =====================================================
  // CLEANUP
  // =====================================================

  ngOnDestroy(): void {

    this.stopOtpTimer();

  }

}
