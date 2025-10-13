import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TransferenciaContas } from './transferencia-contas';

describe('TransferenciaContas', () => {
  let component: TransferenciaContas;
  let fixture: ComponentFixture<TransferenciaContas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaContas],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ]
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
