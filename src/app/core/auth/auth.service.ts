import { HttpClient } from '@angular/common/http';
import {
  Injectable, inject, signal, WritableSignal,
} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  accessTokenKey = 'accessToken';

  refreshTokenKey = 'refreshToken';

  userIdKey = 'userId';

  userNameKey = 'userName';

  $isLogged: WritableSignal<boolean> = signal(false);

  constructor() {
    this.$isLogged.set(!!localStorage.getItem(this.accessTokenKey));
  }

  signUp(name: string, email: string, password: string):
    Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(`${environment.api}signup`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string, rememberMe: boolean):
    Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(`${environment.api}login`, {
      email,
      password,
      rememberMe,
    });
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(`${environment.api}refresh`, { refreshToken: tokens.refreshToken });
    }
    throw throwError(() => 'Can not use token');
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(`${environment.api}logout`, {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can not find token'); // если токенов нет или рефреш токена нет, то мы должны вернуть ошибку, причем которая сгенерирует Observable
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.$isLogged.set(true);
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.$isLogged.set(false);
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(userId: string | null) {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  set userName(userName: string | null) {
    if (userName) {
      localStorage.setItem(this.userNameKey, userName);
    } else {
      localStorage.removeItem(this.userNameKey);
    }
  }

  get userName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(`${environment.api}users`);
  }
}
