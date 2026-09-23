import { inject } from '@angular/core';

import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import {
  AuthService
} from '../auth.service';


export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const token =
    localStorage.getItem('railflow_token');

  /*
   * No JWT available.
   */
  if (!token) {
    return next(req);
  }

  /*
   * Add JWT to outgoing request.
   */
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  /*
   * Handle backend response.
   */
  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      /*
       * 401 means authentication is
       * no longer valid.
       */
      if (error.status === 401) {

        console.log(
          'JWT expired or invalid.'
        );

        /*
         * Centralized logout.
         */
        authService.logout();

        /*
         * Return user to login screen.
         */
        router.navigate(['/login']);
      }

      /*
       * Pass other errors back
       * to the original caller.
       */
      return throwError(() => error);
    })
  );
};