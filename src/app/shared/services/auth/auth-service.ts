import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { env } from '../../../../environments/env.dev';
import { ErrorMessage } from '../../custom/message';
import { ErrorReasons } from '../../custom/error-reasons';
import { Observable } from 'rxjs';

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
    this.http.post<Auth>(`${env.API}/token/`, auth).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', (response as any).access);
        localStorage.setItem('refresh_token', (response as any).refresh);
        this.router.navigate(['/cliente']);
      },
      error: (error) => {
        new ErrorMessage(
          'Oops...',
          'Usuário e/ou senha inválidos!',
          new ErrorReasons(error)
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

  refreshToken(refresh: string): Observable<string> {
    return this.http.post<string>(`${env.API}/refresh/`, { refresh });
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
