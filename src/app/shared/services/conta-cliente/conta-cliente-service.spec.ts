import { TestBed } from '@angular/core/testing';

import { ContaClienteService } from './conta-cliente-service';

describe('ContaClienteService', () => {
  let service: ContaClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
