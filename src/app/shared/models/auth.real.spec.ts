import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient
} from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map, switchMap } from 'rxjs';
import { Empty, Post } from '../core/http';
import { FakeStorage } from '../core/storage';
import { AuthTokens, AuthTokensFrom, Credentials, CredentialsOf } from './auth';

describe('auth', () => {
  const url = 'https://aula-angular.bcorp.tec.br/api';
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient()]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should update auth tokens', (done) => {
    const storage = new FakeStorage();
    new Post<Credentials, AuthTokens>(
      http,
      `${url}/token/`,
      new CredentialsOf('admin', '12345678')
    )
      .send(new Empty())
      .value()
      .pipe(
        map((tokens: AuthTokens) => {
          storage.store('access_token', tokens.access);
          storage.store('refresh_token', tokens.refresh);
          return new AuthTokensFrom(http, storage);
        })
      )
      .pipe(switchMap((tokens: AuthTokens) => tokens.update()))
      .subscribe({
        next: (refreshedTokens: AuthTokens) => {
          const storedAccess = storage.value('access_token')[0];
          const storedRefresh = storage.value('refresh_token')[0];
          expect(storedAccess).not.toEqual(refreshedTokens.access);
          expect(storedRefresh).toEqual(refreshedTokens.refresh);
          done();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          done();
        }
      });
  });
});
