import { Injectable, inject } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import {
  Observable, catchError, switchMap, throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService);

  router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });

      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            // почему-то при истекшем токене выдает 500 ошибку, а не 401
            if (error.status === 500 && !authReq.url.includes('login')
              && !authReq.url.includes('refresh')) {
              return this.handle500Error(authReq, next);
            }
            return throwError(() => error);
          }),
          // оператор выполнит переданную функцию, когда Observable завершится успешно или с ошибкой
        );
    }
    return next.handle(req);
  }

  handle500Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }
          const refreshResult = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации';
          }
          if (error) {
            // именно такую генерацию ошибки мы должны использовать в Observable
            return throwError(() => new Error(error));
          }
          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken),
          });

          return next.handle(authReq);
        }),
        catchError((error) => {
          this.authService.removeTokens();
          this.router.navigate(['/']);
          return throwError(() => error);
        }),
      );
  }
}
