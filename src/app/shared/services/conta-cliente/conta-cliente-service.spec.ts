import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ContaClienteService } from './conta-cliente-service';

describe('ContaClienteService', () => {
  let service: ContaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        ContaClienteService
      ]
    });
    service = TestBed.inject(ContaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
