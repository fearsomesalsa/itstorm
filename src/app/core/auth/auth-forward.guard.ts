import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';

export const authForwardGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const location = inject(Location);

  if (authService.$isLogged()) {
    location.back();
    return false;
  }
  return true;
};
