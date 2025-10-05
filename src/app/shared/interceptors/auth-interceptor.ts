import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

const RETRY_FLAG = new HttpContextToken<boolean>(() => false);

// Helper: adiciona o header Authorization se existir token
function withAuth(req: HttpRequest<any>, token: string | null) {
  return token ?
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}

// Evita interceptar as rotas de autenticação
function isAuthRoute(url: string) {
  return url.includes('/token/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  // Não intercepta login/refresh
  if (isAuthRoute(req.url)) return next(req);
  // 1) Envia a requisição com o access token atual (se existir)
  const reqWithToken = withAuth(req, auth.getToken());
  return next(reqWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se não for 401, só propaga o erro
      if (error.status !== 401) return throwError(() => error);
      // Evita loop: só tentamos 1x o refresh por requisição
      const alreadyTried = req.context.has(RETRY_FLAG);
      if (alreadyTried) {
        auth.logout(); // sessão realmente inválida
        return throwError(() => error);
      }
      // 2) Tenta o refresh usando o refresh_token salvo
      const refresh = auth.getRefresh();
      if (!refresh) {
        auth.logout();
        return throwError(() => error);
      }
      return auth.refreshToken(refresh).pipe(
        switchMap((resp: any) => {
          // SimpleJWT costuma devolver { access: '...' }
          const newAccess = resp?.access;
          if (!newAccess) {
            auth.logout();
            return throwError(() => error);
          }
          // Salva novo access e reenvia a mesma requisição com ele
          localStorage.setItem('access_token', newAccess);
          const retried = withAuth(
            req.clone({ context: req.context.set(RETRY_FLAG, true) }),
            newAccess
          );
          return next(retried);
        }),
        catchError((err) => {
          // Refresh falhou → força login
          auth.logout();
          return throwError(() => err);
        })
      );
    })
  );
};
