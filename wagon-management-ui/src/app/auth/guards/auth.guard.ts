import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token =
    localStorage.getItem('railflow_token');

  if (token) {

    return true;
  }

  console.log(
    'Access denied: JWT not found'
  );

  return router.createUrlTree([
    '/login'
  ]);
};