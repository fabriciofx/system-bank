import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SaqueConta } from './saque-conta';

describe('SaqueConta', () => {
  let component: SaqueConta;
  let fixture: ComponentFixture<SaqueConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaqueConta],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SaqueConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
