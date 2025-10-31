import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DepositoConta } from './deposito-conta';

describe('DepositoConta', () => {
  let component: DepositoConta;
  let fixture: ComponentFixture<DepositoConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoConta],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositoConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
