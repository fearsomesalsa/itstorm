import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LoginResponseType } from 'src/types/login-response.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-singup',
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
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic',
      },
    },
  ],
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class SingupComponent {
  fb = inject(FormBuilder);

  authService = inject(AuthService);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  passwordIsShown = false;

  signUpForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^\s*([А-Я][а-я]+\s*)+$/)]], // Имя может содержать русские буквы и пробелы. Каждое новое слово - с большой буквы.    + После заглавной буквы хотя бы одна строчная. Имя содержит хотя бы одно слово
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]], // Пароль должен быть не менее 8 символов, содержать как минимум 1 букву в верхнем регистре и как минимум 1 цифру.   + Может не содержать строчных букв, например 12345678Q - valid
    agreement: [true, [Validators.requiredTrue]],
  });

  signUp() {
    if (this.signUpForm.valid && this.signUpForm.value.name
      && this.signUpForm.value.email && this.signUpForm.value.password) {
      this.authService.signUp(
        this.signUpForm.value.name,
        this.signUpForm.value.email,
        this.signUpForm.value.password,
      ).subscribe(
        {
          next: (response: LoginResponseType | DefaultResponseType) => {
            let error: string | null = null;
            if ((response as DefaultResponseType).error !== undefined) {
              error = (response as DefaultResponseType).message;
            }

            const signUpResponse = response as LoginResponseType;
            if (!signUpResponse.accessToken || !signUpResponse.refreshToken
                || !signUpResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(signUpResponse.accessToken, signUpResponse.refreshToken);
            this.authService.userId = signUpResponse.userId;
            if (this.signUpForm.value.name) {
              this.authService.userName = this.signUpForm.value.name;
            }
            this.snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка регистрации');
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
