import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroConta } from './cadastro-conta';

describe('CadastroConta', () => {
  let component: CadastroConta;
  let fixture: ComponentFixture<CadastroConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroConta],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
