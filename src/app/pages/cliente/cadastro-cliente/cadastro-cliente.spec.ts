import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { CadastroCliente } from './cadastro-cliente';

describe('CadastroCliente', () => {
  let component: CadastroCliente;
  let fixture: ComponentFixture<CadastroCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCliente],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideNgxMask()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
