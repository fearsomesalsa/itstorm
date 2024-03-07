import {
  Component, effect, inject, Injector, HostListener, OnDestroy, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute, IsActiveMatchOptions, Router, RouterModule,
} from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoType } from 'src/types/user-info.type';
import { Subscription } from 'rxjs';
import { DefaultResponseType } from 'src/types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);

  injector = inject(Injector);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  activatedRoute = inject(ActivatedRoute);

  linkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };

  isLogged = false;

  userName = 'Тест';

  userInfoSubscription: Subscription | null = null;

  logoutSubscription: Subscription | null = null;

  scrolled = false;

  ngOnInit(): void {
    effect(() => {
      this.isLogged = this.authService.$isLogged();
      if (this.isLogged) {
        this.userInfoSubscription = this.authService.getUserInfo().subscribe({
          next: (userInfoResponse: UserInfoType | DefaultResponseType) => {
            let error = '';
            if ((userInfoResponse as DefaultResponseType).error !== undefined) {
              error = (userInfoResponse as DefaultResponseType).message;
              throw new Error((userInfoResponse as DefaultResponseType).message);
            }
            const userInfo = userInfoResponse as UserInfoType;
            if (!userInfo.id || !userInfo.name || !userInfo.email) {
              error = 'Ошибка данных пользователя';
            }
            if (error) {
              this.snackBar.open(error);
            }
            this.userName = userInfo.name;
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Возникла ошибка');
            }
          },
        });
      }
    }, { injector: this.injector });
  }

  logout() {
    this.logoutSubscription = this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        },
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.userName = null;
    this.snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll', ['$event'])
  scroll() {
    if (window.scrollY > 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  ngOnDestroy(): void {
    this.userInfoSubscription?.unsubscribe();
    this.logoutSubscription?.unsubscribe();
  }
}
