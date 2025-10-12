import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AccessToken } from '../models/auth';

const RETRY_FLAG = new HttpContextToken<boolean>(() => false);

// Adiciona o header Authorization se existir token
function withAuth<T>(request: HttpRequest<T>, token: string): HttpRequest<T> {
  if (token) {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
  } else {
    return request;
  }
}

// Verifica se é uma rota de autenticação
function isAuthRoute(url: string): boolean {
  return url.includes('/token/');
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  // Não intercepta login/refresh
  if (isAuthRoute(request.url)) {
    return next(request);
  }
  // 1) Envia a requisição com o access token atual (se existir)
  const requestWithToken = withAuth(request, authService.accessToken());
  return next(requestWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se não for 401, só propaga o erro
      if (error.status !== 401) {
        return throwError(() => error);
      }
      // Evita loop: só tentamos 1x o refresh por requisição
      const alreadyTried = request.context.has(RETRY_FLAG);
      if (alreadyTried) {
        // Sessão realmente inválida
        authService.logout();
        return throwError(() => error);
      }
      // 2) Tenta o refresh usando o refresh_token salvo
      const refresh = authService.refreshToken();
      if (!refresh) {
        authService.logout();
        return throwError(() => error);
      }
      return authService.refresh(refresh).pipe(
        switchMap((token: AccessToken) => {
          // SimpleJWT costuma devolver { access: '...' }
          const newAccess = token.access;
          if (!newAccess) {
            authService.logout();
            return throwError(() => error);
          }
          // Salva novo access e reenvia a mesma requisição com ele
          localStorage.setItem('access_token', newAccess);
          const retried = withAuth(
            request.clone({ context: request.context.set(RETRY_FLAG, true) }),
            newAccess
          );
          return next(retried);
        }),
        catchError((error: HttpErrorResponse) => {
          // Refresh falhou → força login
          authService.logout();
          return throwError(() => error);
        })
      );
    })
  );
};
