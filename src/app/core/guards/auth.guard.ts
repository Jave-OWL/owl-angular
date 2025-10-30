import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/inicio-de-sesion'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const requiresAdmin = route.data['requiresAdmin'] === true;
  if (requiresAdmin && !authService.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};