import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Empty, Get } from './http';

describe('http core', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should send a get request', () => {
    const msg = 'As credenciais de autenticação não foram fornecidas.';
    const response = new Get<{ detail: string }>(
      http,
      '/api/token'
    ).send(new Empty());
    response.value().subscribe(result => {
      expect(result.detail).toBe(msg);
    });
    const req = controller.expectOne('/api/token');
    req.flush({ detail: msg });
    controller.verify();
  });
});
