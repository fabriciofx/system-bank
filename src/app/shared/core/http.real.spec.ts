import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { Authenticated, Empty, Get, Post } from './http';
import { AuthTokens, Credentials, CredentialsOf } from '../models/auth';
import { Cliente } from '../models/cliente';

describe('http core', () => {
  const url = 'https://aula-angular.bcorp.tec.br/api';
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient()
      ]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should send a get request', (done) => {
    const msg = "As credenciais de autenticação não foram fornecidas.";
    const response = new Get<{detail: string}>(http, url).send(new Empty());
    response.value().subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.error.detail).toEqual(msg);
        done();
      }
    });
  });

  it('should send a post request', (done) => {
    const credentials = new CredentialsOf(
      { username: 'admin', password: '12345678' }
    );
    const response = new Post<Credentials, AuthTokens>(
      http,
      `${url}/token/`,
      credentials
    ).send(new Empty());
    response.value().subscribe({
      next: (tokens: AuthTokens) => {
        expect(tokens.access).toBeTruthy();
        done();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        done();
      }
    });
  });

  it('should send an authenticated get request', (done) => {
    const response = new Authenticated(
      new Get<Cliente[]>(http, `${url}/clientes/`),
      new CredentialsOf({ username: 'admin', password: '12345678'})
    ).send(new Empty());
    response.value().subscribe({
      next: (clientes: Cliente[]) => {
        expect(clientes.length).toBeGreaterThanOrEqual(5);
        done();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.message);
        done();
      }
    });
  });
});
