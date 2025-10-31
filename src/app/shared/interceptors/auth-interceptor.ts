import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AccessToken } from '../models/auth';
import { AuthService } from '../services/auth/auth-service';

const RETRY_FLAG = new HttpContextToken<boolean>(() => false);

// Adiciona o header Authorization se existir token
function withAuth<T>(
  request: HttpRequest<T>,
  token: AccessToken
): HttpRequest<T> {
  if (token.valid()) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token.access}` }
    });
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
      const refreshToken = authService.refreshToken();
      if (!refreshToken.valid()) {
        authService.logout();
        return throwError(() => error);
      }
      return authService.refresh(refreshToken).pipe(
        switchMap((accessToken: AccessToken) => {
          // SimpleJWT costuma devolver { access: '...' }
          if (!accessToken.valid()) {
            authService.logout();
            return throwError(() => error);
          }
          // Salva novo access e reenvia a mesma requisição com ele
          authService.store(accessToken);
          const retried = withAuth(
            request.clone({ context: request.context.set(RETRY_FLAG, true) }),
            accessToken
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
