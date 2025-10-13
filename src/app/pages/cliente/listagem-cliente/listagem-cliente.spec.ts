import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ListagemCliente } from './listagem-cliente';

describe('ListagemCliente', () => {
  let component: ListagemCliente;
  let fixture: ComponentFixture<ListagemCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemCliente],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
