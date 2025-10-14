import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { Get } from './http';

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

  it('should send a get request', () => {
    const msg = "As credenciais de autenticação não foram fornecidas.";
    const response = new Get<{ detail: string }>(http, `${url}/token`).send();
    response.value().subscribe(result => {
      expect(result.detail).toBe(msg);
    });
  });
});
