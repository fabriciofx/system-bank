import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ListagemConta } from './listagem-conta';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { PageResult } from '../../../shared/core/page-result';
import { ContaCliente } from '../../../shared/models/conta-cliente';
import { PageEvent } from '@angular/material/paginator';

describe('ListagemConta', () => {
  let fixture: ComponentFixture<ListagemConta>;
  let component: ListagemConta;
  let contaClienteServiceSpy: jasmine.SpyObj<ContaClienteService>;

  beforeEach(async () => {
    contaClienteServiceSpy = jasmine.createSpyObj(
      'ContaClienteService',
      ['pages', 'delete']
    );
    await TestBed.configureTestingModule({
      imports: [ListagemConta],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        { provide: ContaClienteService, useValue: contaClienteServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListagemConta);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call service.pages and populate dataSource', () => {
    const mockPage: PageResult<ContaCliente> = {
      items: [
        {
          id: 1,
          numero: '1234',
          agencia: '0001',
          saldo: '500',
          asString: () => '1234',
          cliente: {
            id: 2,
            nome: 'Yegor Bugayenko',
            cpf: '11111111111',
            email: 'yegor@yegor256.com',
            senha: '',
            ativo: true,
            observacoes: '',
            asString: () => 'Yegor Bugayenko'
          }
        }
      ],
      page: 1,
      pageSize: 5,
      total: 1
    };
    contaClienteServiceSpy.pages.and.returnValue(of(mockPage));
    component.load(1, 5);
    expect(contaClienteServiceSpy.pages).toHaveBeenCalledWith(1, 5);
    expect(component.source().data.length).toBe(1);
    expect(component.source().data[0].id).toBe(1);
    expect(component.loading()).toBeFalsy();
  });

  it('should call load() with correct params onPageChange()', () => {
    const spy = spyOn(component, 'load');
    component.onPageChange({ pageIndex: 2, pageSize: 10 } as PageEvent);
    expect(spy).toHaveBeenCalledWith(3, 10);
  });
});
