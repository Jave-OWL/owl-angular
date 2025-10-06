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

  // Check for required roles
  const requiredRole = route.data['role'] as 'administrador' | 'usuario';
  if (requiredRole && !authService.hasRole(requiredRole)) {
    router.navigate(['/']); // Redirect to home or unauthorized page
    return false;
  }

  return true;
};