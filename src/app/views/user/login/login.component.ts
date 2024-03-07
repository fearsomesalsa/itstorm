import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LoginResponseType } from 'src/types/login-response.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  fb = inject(FormBuilder);

  router = inject(Router);

  authService = inject(AuthService);

  snackBar = inject(MatSnackBar);

  passwordIsShown = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password,
        !!this.loginForm.value.rememberMe,
      ).subscribe(
        {
          next: (response: LoginResponseType | DefaultResponseType) => {
            let error: string | null = null;
            if ((response as DefaultResponseType).error !== undefined) {
              error = (response as DefaultResponseType).message;
            }

            const loginResponse = response as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken
                || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(
              loginResponse.accessToken,
              loginResponse.refreshToken,
            );
            this.authService.userId = loginResponse.userId;
            this.snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка авторизации');
            }
          },
        },
      );
    }
  }

  togglePasswordVisibility() {
    this.passwordIsShown = !this.passwordIsShown;
  }
}
