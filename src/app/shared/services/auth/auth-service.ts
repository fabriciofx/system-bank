import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AccessToken, AccessTokenOf, Auth, AuthTokens, AuthTokensOf, RefreshToken, RefreshTokenOf } from '../../models/auth';
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
    this.http.post<AuthTokens>(`${env.API}/token/`, auth)
      .pipe(
        map(tokens => new AuthTokensOf(tokens.access, tokens.refresh)),
        map(tokens => {
          if (!tokens.valid()) {
            throw new Error("Error: AuthTokens is invalid!");
          }
          return tokens;
        }),
        catchError(error => throwError(() => error))
      )
      .subscribe({
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

  refresh(token: RefreshToken): Observable<AccessToken> {
    if (token.valid()) {
      return this.http.post<AccessToken>(`${env.API}/token/refresh/`, token);
    } else {
      throw new Error("Error: RefreshToken is invalid!");
    }
  }

  refreshToken(): RefreshToken {
    return new RefreshTokenOf(this.storage.value('refresh_token')?.[0] ?? "");
  }

  accessToken(): AccessToken {
    return new AccessTokenOf(this.storage.value('access_token')?.[0] ?? "");
  }

  store(token: AccessToken): void {
    if (token.valid()) {
      this.storage.store('access_token', token.access);
    } else {
      throw new Error("Error: AccessToken is invalid!");
    }
  }
}
