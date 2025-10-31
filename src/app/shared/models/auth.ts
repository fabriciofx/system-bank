import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Empty, Post } from '../core/http';
import { Storage } from '../core/storage';

export interface Credentials {
  username: string;
  password: string;
  valid(): boolean;
}

export interface AccessToken {
  access: string;
  valid(): boolean;
}

export interface RefreshToken {
  refresh: string;
  valid(): boolean;
}

export interface AuthTokens extends AccessToken, RefreshToken {
  valid(): boolean;
  update(): Observable<AuthTokens>;
}

export class CredentialsFrom implements Credentials {
  username: string;
  password: string;

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
  }

  valid(): boolean {
    return !!this.username && !!this.password;
  }
}

export class CredentialsOf implements Credentials {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  valid(): boolean {
    return !!this.username && !!this.password;
  }
}

export class AccessTokenOf implements AccessToken {
  access: string;

  constructor(access: string) {
    this.access = access;
  }

  valid(): boolean {
    return !!this.access;
  }
}

export class RefreshTokenOf implements RefreshToken {
  refresh: string;

  constructor(refresh: string) {
    this.refresh = refresh;
  }

  valid(): boolean {
    return !!this.refresh;
  }
}

export class AuthTokensOf implements AuthTokens {
  private readonly http: HttpClient;
  private readonly url: string;
  access: string;
  refresh: string;

  constructor(
    http: HttpClient,
    access: string,
    refresh: string,
    url = 'https://aula-angular.bcorp.tec.br/api/token/refresh/'
  ) {
    this.http = http;
    this.access = access;
    this.refresh = refresh;
    this.url = url;
  }

  valid(): boolean {
    return !!this.access && !!this.refresh;
  }

  update(): Observable<AuthTokens> {
    return new Post<RefreshToken, AccessToken>(
      this.http,
      this.url,
      new RefreshTokenOf(this.refresh)
    )
      .send(new Empty())
      .value()
      .pipe(
        map((token: AccessToken) => {
          return new AuthTokensOf(
            this.http,
            token.access,
            this.refresh,
            this.url
          );
        }),
        catchError((error: HttpErrorResponse) =>
          throwError(
            () => new Error(`to refresh access token: ${error.message}`)
          )
        )
      );
  }
}

export class AuthTokensFrom implements AuthTokens {
  private readonly tokens: AuthTokens;
  access: string;
  refresh: string;

  constructor(
    http: HttpClient,
    storage: Storage,
    url = 'https://aula-angular.bcorp.tec.br/api/token/refresh/'
  ) {
    this.access = storage.value('access_token')?.[0] ?? '';
    this.refresh = storage.value('refresh_token')?.[0] ?? '';
    this.tokens = new AuthTokensOf(http, this.access, this.refresh, url);
  }

  valid(): boolean {
    return this.tokens.valid();
  }

  update(): Observable<AuthTokens> {
    return this.tokens.update();
  }
}
