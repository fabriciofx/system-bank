import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContaService } from './conta-service';

describe('ContaService', () => {
  let service: ContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        ContaService
      ]
    });
    service = TestBed.inject(ContaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
