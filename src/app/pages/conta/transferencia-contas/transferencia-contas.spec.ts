import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaContas } from './transferencia-contas';

describe('TransferenciaContas', () => {
  let component: TransferenciaContas;
  let fixture: ComponentFixture<TransferenciaContas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaContas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaContas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
