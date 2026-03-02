import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('dc_user_token');
  const userStr = localStorage.getItem('dc_user');

  if (!token || !userStr) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    const allowedRoles = route.data?.['roles'] as string[] | undefined;

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        router.navigate(['/']);
        return false;
      }
    }

    return true;
  } catch {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
