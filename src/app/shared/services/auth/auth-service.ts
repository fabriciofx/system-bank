import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessToken, Auth, AuthTokens } from '../../models/auth';
import { env } from '../../../../environments/env.dev';
import { ErrorMessage } from '../../custom/message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient;
  private readonly router: Router;

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  login(auth: Auth): void {
    this.http.post<AuthTokens>(`${env.API}/token/`, auth).subscribe({
      next: (tokens: AuthTokens) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        this.router.navigate(['/cliente']);
      },
      error: () => {
        new ErrorMessage(
          'Oops...',
          'Usuário e/ou senha inválidos!'
        ).show();
      }
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.router.navigate(['/auth']);
  }

  refreshToken(refresh: string): Observable<AccessToken> {
    return this.http.post<AccessToken>(
      `${env.API}/token/refresh/`,
      { 'refresh': refresh }
    );
  }

  getRefresh(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('refresh_token') || "";
    }
    return "";
  }

  getToken(): string {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token') || "";
    }
    return "";
  }
}
