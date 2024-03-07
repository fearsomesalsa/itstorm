import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SingupComponent } from './singup.component';

describe('SingupComponent', () => {
  let component: SingupComponent;
  let fixture: ComponentFixture<SingupComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp', 'login', 'setTokens', 'userId', 'userName']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [
        SingupComponent,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: { params: of({ url: 'test' }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(SingupComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button and make form invalid when signup form name input is empty', () => {
    component.signUpForm.setValue({
      name: '',
      email: 'test@gmail.com',
      password: '12345678',
      agreement: true,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.signUpForm.get('name')?.valid).toBeFalsy();
    expect(component.signUpForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should disable button and make form invalid when signup form email input is empty', () => {
    component.signUpForm.setValue({
      name: 'Тест',
      email: '',
      password: '12345678',
      agreement: true,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.signUpForm.get('email')?.valid).toBeFalsy();
    expect(component.signUpForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should disable button and make form invalid when signup form email input does not satisfy Validators.email', () => {
    component.signUpForm.setValue({
      name: 'Тест',
      email: 'email',
      password: '12345678',
      agreement: true,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.signUpForm.get('email')?.valid).toBeFalsy();
    expect(component.signUpForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should disable button and make form invalid when signup form password input is empty', () => {
    component.signUpForm.setValue({
      name: 'Тест',
      email: 'test@gmail.com',
      password: '',
      agreement: true,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.signUpForm.get('password')?.valid).toBeFalsy();
    expect(component.signUpForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should disable button and make form invalid when signup form agreement input is false', () => {
    component.signUpForm.setValue({
      name: 'Тест',
      email: 'test@gmail.com',
      password: '12345678',
      agreement: false,
    });
    fixture.detectChanges();
    const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');

    expect(component.signUpForm.get('agreement')?.valid).toBeFalsy();
    expect(component.signUpForm.valid).toBeFalse();
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should disable button, make form invalid, show error message when user inputs empty name', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('name')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const nameInputElement = fixture.debugElement.nativeElement.querySelector('#name') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-name');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('name')?.value).toEqual(nameInputElement.value);
        expect(component.signUpForm.get('name')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Введите имя');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user inputs name which does not match pattern', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('name')?.patchValue('иван');
      component.signUpForm?.get('name')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const nameInputElement = fixture.debugElement.nativeElement.querySelector('#name') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-name');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('name')?.value).toEqual(nameInputElement.value);
        expect(component.signUpForm.get('name')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Имя может содержать русские буквы и пробелы. Каждое слово с большой буквы');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user inputs empty email', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('email')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-email');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.signUpForm.get('email')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Введите e-mail');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user inputs invalid email', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('email')?.patchValue('test');
      component.signUpForm?.get('email')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-email');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.signUpForm.get('email')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('E-mail должен иметь формат example@gmail.com');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user inputs empty password', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('password')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-password');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.signUpForm.get('password')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Введите пароль');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user inputs invalid password', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('password')?.patchValue('password123');
      component.signUpForm?.get('password')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-password');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.signUpForm.get('password')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Пароль должен быть не менее 8 символов, содержать как минимум 1 букву в верхнем регистре и как минимум 1 цифру');
      });
    });
  }));

  it('should disable button, make form invalid, show error message when user does not approve agreement', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('agreement')?.patchValue(false);
      component.signUpForm?.get('agreement')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const agreementCheckboxElement = fixture.debugElement.nativeElement.querySelector('#agreement input') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.error-agreement');

        expect(buttonElement.disabled).toBeTruthy();
        expect(component.signUpForm.get('agreement')?.value).toEqual(agreementCheckboxElement.checked);
        expect(component.signUpForm.get('agreement')?.valid).toBeFalsy();
        expect(component.signUpForm.valid).toBeFalsy();
        expect(errorElement).not.toBeNull();
        expect(errorElement?.textContent).toContain('Необходимо подтвердить принятие условий пользовательского соглашения и согласие на обработку персональных данных');
      });
    });
  }));

  it('should undisable button, make form valid when user inputs valid data', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.signUpForm?.get('name')?.patchValue('Анна');
      component.signUpForm?.get('name')?.markAsTouched();

      component.signUpForm?.get('email')?.patchValue('anna@gmail.com');
      component.signUpForm?.get('email')?.markAsTouched();

      component.signUpForm?.get('password')?.patchValue('12345678Q');
      component.signUpForm?.get('password')?.markAsTouched();

      component.signUpForm?.get('agreement')?.patchValue(true);
      component.signUpForm?.get('agreement')?.markAsTouched();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const nameInputElement = fixture.debugElement.nativeElement.querySelector('#name') as HTMLInputElement;
        const emailInputElement = fixture.debugElement.nativeElement.querySelector('#email') as HTMLInputElement;
        const passwordInputElement = fixture.debugElement.nativeElement.querySelector('#password') as HTMLInputElement;
        const agreementCheckboxElement = fixture.debugElement.nativeElement.querySelector('#agreement input') as HTMLInputElement;
        const buttonElement: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#button');
        const errorElement: HTMLElement = fixture.debugElement.nativeElement.querySelector('.form-error');

        expect(buttonElement.disabled).toBeFalsy();
        expect(component.signUpForm.get('name')?.value).toEqual(nameInputElement.value);
        expect(component.signUpForm.get('email')?.value).toEqual(emailInputElement.value);
        expect(component.signUpForm.get('password')?.value).toEqual(passwordInputElement.value);
        expect(component.signUpForm.get('agreement')?.value).toEqual(agreementCheckboxElement.checked);
        expect(component.signUpForm.valid).toBeTruthy();
        expect(errorElement).toBeNull();
      });
    });
  }));

  it('should call authService.signUp() with signup form valid values and then call snackbar.open() with successful message', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.signUp.and.returnValue(of({
      accessToken: 'token',
      refreshToken: 'token',
      userId: 'id',
    }));

    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    snackBarSpy.open.and.callThrough();

    component.signUpForm.setValue({
      name: 'Анна',
      email: 'anna@gmail.com',
      password: '12345678Q',
      agreement: true,
    });

    component.signUp();

    expect(authServiceSpy.signUp).toHaveBeenCalledWith('Анна', 'anna@gmail.com', '12345678Q');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Вы успешно зарегистрировались');
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
