import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp', 'login', 'setTokens', 'userId', 'userName']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: { params: of({ url: 'test' }) } },
        { provide: Router, useValue: routerSpy },
      ],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make form invalid when both login form inputs are empty', () => {
    component.loginForm.setValue({
      email: '',
      password: '',
      rememberMe: false,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.loginForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should make form invalid when login form email input is empty', () => {
    component.loginForm.setValue({
      email: '',
      password: '123',
      rememberMe: false,
    });
    expect(component.loginForm.valid).toEqual(false);
  });

  it('should make form invalid when login form password input is empty', () => {
    component.loginForm.setValue({
      email: 'test',
      password: '',
      rememberMe: false,
    });
    expect(component.loginForm.valid).toEqual(false);
  });

  it('should disable button, make form invalid, show error message when user input empty data for both inputs', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
      component.loginForm?.get('email')?.markAsTouched();

      const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
      component.loginForm?.get('password')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const emailErrorElement = fixture.debugElement.nativeElement.querySelector('.error-email');
        const passwordErrorElement = fixture.debugElement.nativeElement.querySelector('.error-password');
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.loginForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.loginForm.get('email')?.valid).toBeFalsy();
        expect(component.loginForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.loginForm.get('password')?.valid).toBeFalsy();
        expect(component.loginForm.valid).toBeFalsy();
        expect(emailErrorElement).not.toBeNull();
        expect(emailErrorElement?.textContent).toContain('Введите e-mail');
        expect(passwordErrorElement).not.toBeNull();
        expect(passwordErrorElement?.textContent).toContain('Введите пароль');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user input invalid email', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
      component.loginForm?.get('email')?.patchValue('test');
      component.loginForm?.get('email')?.markAsTouched();

      const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
      component.loginForm?.get('password')?.patchValue('123');
      component.loginForm?.get('password')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const emailErrorElement = fixture.debugElement.nativeElement.querySelector('.error-email');
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.loginForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.loginForm.get('email')?.valid).toBeFalsy();
        expect(component.loginForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.loginForm.get('password')?.valid).toBeTruthy(); // у тестового пользователя пароль 12345678 - он невалиден для регистрации, но для логина я не устанавливала валидатор пароля по паатерну, чтобы можно было логинить Теста
        expect(component.loginForm.valid).toBeFalsy();
        expect(emailErrorElement).not.toBeNull();
        expect(emailErrorElement?.textContent).toContain('E-mail должен иметь формат example@gmail.com');
      });
    });
  }));

  it('should undisable form buttom and make form valid when user input valid data', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
      emailInputElement.value = 'test@gmail.com';
      emailInputElement.dispatchEvent(new Event('input'));

      const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
      passwordInputElement.value = '12345678';
      passwordInputElement.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

        expect(buttonElement.disabled).toBeFalsy();
        expect(component.loginForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.loginForm.get('email')?.valid).toBeTruthy();
        expect(component.loginForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.loginForm.get('password')?.valid).toBeTruthy();
        expect(component.loginForm.valid).toBeTruthy();
      });
    });
  }));

  it('should call authService.login() with login form valid values and then call snackbar.open() with successful message', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.login.and.returnValue(of({
      accessToken: 'token',
      refreshToken: 'token',
      userId: 'id',
    }));

    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    snackBarSpy.open.and.callThrough();

    const routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routerSpy.navigate.and.callThrough();

    component.loginForm.setValue({
      email: 'test@gmail.com',
      password: '12345678',
      rememberMe: false,
    });

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@gmail.com', '12345678', false);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Вы успешно авторизовались');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call authService.login(), get an response error 401 and call snackbar.open() with server error message', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.login.and.returnValue(throwError(() => new HttpErrorResponse({
      error: {
        error: true,
        message: 'Неправильный E-mail или пароль',
      },
      status: 401,
      statusText: 'Unathorized',
    })));

    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    snackBarSpy.open.and.callThrough();

    component.loginForm.setValue({
      email: 'test@gmail.com',
      password: '12345678s',
      rememberMe: false,
    });

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@gmail.com', '12345678s', false);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Неправильный E-mail или пароль');
  });

  it('should call authService.login(), get an response error (not 401) and call snackbar.open() with my error message', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.login.and.returnValue(throwError(() => new HttpErrorResponse({})));

    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    snackBarSpy.open.and.callThrough();

    component.loginForm.setValue({
      email: 'test@gmail.com',
      password: '12345678s',
      rememberMe: false,
    });

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@gmail.com', '12345678s', false);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Ошибка авторизации');
  });

  it('should hide password when passwordIsShown = false', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const passwordInputElement = compiled.querySelector('#password') as HTMLInputElement;
    expect(passwordInputElement.type).toBe('password');
  });

  it('should show password when passwordIsShown = true', () => {
    component.passwordIsShown = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const passwordInputElement = compiled.querySelector('#password') as HTMLInputElement;
    expect(passwordInputElement.type).toBe('text');
  });
});
