import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ListagemConta } from './listagem-conta';

describe('ListagemConta', () => {
  let fixture: ComponentFixture<ListagemConta>;
  let component: ListagemConta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemConta],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ListagemConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
