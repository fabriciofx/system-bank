import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessToken, Auth, AuthTokens } from '../../models/auth';
import { env } from '../../../../environments/env.dev';
import { ErrorMessage } from '../../components/message/message';
import { Storage, BrowserStorage } from '../../core/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient;
  private readonly router: Router;
  private readonly storage: Storage;

  constructor(http: HttpClient, router: Router, storage: BrowserStorage) {
    this.http = http;
    this.router = router;
    this.storage = storage;
  }

  login(auth: Auth): void {
    this.http.post<AuthTokens>(`${env.API}/token/`, auth).subscribe({
      next: (tokens: AuthTokens) => {
        this.storage.store('access_token', tokens.access);
        this.storage.store('refresh_token', tokens.refresh);
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
    this.storage.remove('access_token');
    this.storage.remove('refresh_token');
    this.router.navigate(['/auth']);
  }

  refresh(token: string): Observable<AccessToken> {
    return this.http.post<AccessToken>(
      `${env.API}/token/refresh/`,
      { 'refresh': token }
    );
  }

  refreshToken(): string {
    return this.storage.value('refresh_token')?.[0] ?? "";
  }

  accessToken(): string {
    return this.storage.value('access_token')?.[0] ?? "";
  }
}
