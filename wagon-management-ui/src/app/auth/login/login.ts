import {
  Component,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, interval, Subscription } from 'rxjs';

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

  otpSecondsRemaining = 30;
  otpResendAvailable = false;


  private otpTimer?: Subscription;

  // =====================================================
  // CAPTCHA
  // =====================================================

  captcha = this.generateCaptcha();

  constructor(
  private router: Router,
  private authService: AuthService,
  private cdr: ChangeDetectorRef
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

  this.usernameTouched = true;
  this.passwordTouched = true;
  this.captchaTouched = true;

  this.loginError = '';

  if (
    !this.username.trim() ||
    !this.password ||
    !this.captchaInput.trim()
  ) {
    return;
  }

  if (this.captchaInput !== this.captcha) {

    this.captchaError = true;

    this.loginError =
      'The verification code is incorrect. Please try again.';

    return;
  }

  this.isLoading = true;

  this.cdr.detectChanges();

  this.authService
    .login(
      this.username.trim(),
      this.password
    )
    .pipe(
      finalize(() => {

        this.isLoading = false;

        /*
         * Force the button/loading state to update
         * immediately after the HTTP request completes.
         */
        this.cdr.detectChanges();

      })
    )
    .subscribe({

      next: (response: LoginResponse) => {

        if (!response.success) {

          this.loginError =
            response.message ||
            'Invalid username or password.';

          this.cdr.detectChanges();

          return;
        }

        if (response.otpRequired) {

          this.otpMode = true;

          this.otpInput = '';
          this.otpTouched = false;
          this.otpError = '';

          this.startOtpTimer();

          /*
           * Force Angular to immediately switch
           * from credentials → OTP screen.
           */
          this.cdr.detectChanges();

          return;
        }

        this.loginError =
          'Authentication response was invalid.';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Login API error:',
          error
        );

        if (error.status === 401) {

          this.loginError =
            error.error?.message ||
            'Invalid username or password.';

        } else {

          this.loginError =
            'Unable to connect to the authentication server.';
        }

        this.cdr.detectChanges();
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

  this.otpSecondsRemaining = 30; // TEMPORARY TEST VALUE

  this.otpResendAvailable = false;

  this.cdr.detectChanges();

  this.otpTimer = interval(1000).subscribe(() => {

    if (this.otpSecondsRemaining <= 1) {

      this.otpSecondsRemaining = 0;
      this.otpResendAvailable = true;

      this.stopOtpTimer();

      this.cdr.detectChanges();

      return;
    }

    this.otpSecondsRemaining--;

    /*
     * Angular is not automatically refreshing the
     * timer display in our current setup, so force
     * the view to update after every tick.
     */
    this.cdr.detectChanges();

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

    if (
      !this.otpResendAvailable ||
      this.isLoading
    ) {
      return;
    }

    this.isLoading = true;
    this.otpError = '';

    this.authService
      .resendOtp(
        this.username.trim()
      )
      .pipe(
        finalize(() => {

          this.isLoading = false;

          /*
          * Force the OTP screen to immediately
          * reflect the loading state.
          */
          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (response: LoginResponse) => {

          if (!response.success) {

            this.otpError =
              response.message ||
              'Unable to resend OTP.';

            this.cdr.detectChanges();

            return;
          }
          /*
          * Clear the previous OTP input.
          */
          this.otpInput = '';
          this.otpTouched = false;
          this.otpError = '';

          /*
          * Restart the 5-minute countdown.
          */
          this.startOtpTimer();

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Resend OTP error:',
            error
          );

          this.otpError =
            error.error?.message ||
            'Unable to resend OTP. Please try again.';

          this.cdr.detectChanges();
        }
      });
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
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({

      next: (response: LoginResponse) => {

        if (!response.success) {

          this.otpError =
            response.message ||
            'Invalid or expired OTP.';

          this.cdr.detectChanges();

          return;
        }

        /*
        * JWT received from backend after
        * successful OTP verification.
        */
        if (!response.token) {

          this.otpError =
            'Authentication token was not received.';

          this.cdr.detectChanges();

          return;
        }

        /*
        * Store JWT for the authenticated session.
        */
        localStorage.setItem(
          'railflow_token',
          response.token
        );

        /*
        * Store basic user information as well.
        */
        localStorage.setItem(
          'railflow_username',
          response.username || ''
        );

        localStorage.setItem(
          'railflow_role',
          response.role || ''
        );

        console.log(
          'JWT stored successfully'
        );

        this.stopOtpTimer();

        this.router.navigate([
          '/dashboard'
        ]);
      },

      error: (error) => {

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

  get otpMinutes(): string {

  return Math.floor(
    this.otpSecondsRemaining / 60
  )
    .toString()
    .padStart(2, '0');

}

get otpSeconds(): string {

  return (
    this.otpSecondsRemaining % 60
  )
    .toString()
    .padStart(2, '0');

}

}
