import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paginated } from '../../core/paginated';
import { ContaCliente, ContaClienteDe } from '../../models/conta-cliente';
import { combineLatest, map, Observable } from 'rxjs';
import { PageResult } from '../../core/page-result';
import { env } from '../../../../environments/env.dev';
import { ClienteDe } from '../../models/cliente';
import { ContaService } from '../conta/conta-service';
import { ClienteService } from '../cliente/cliente-service';

@Injectable({
  providedIn: 'root'
})
export class ContaClienteService implements Paginated<ContaCliente> {
  private readonly http: HttpClient;
  private readonly contaService: ContaService;
  private readonly clienteService: ClienteService;

  constructor(
    http: HttpClient,
    contaService: ContaService,
    clienteService: ClienteService
  ) {
    this.http = http;
    this.contaService = contaService;
    this.clienteService = clienteService;
  }

  pages(num: number, size: number): Observable<PageResult<ContaCliente>> {
    const all = this.contaService.liste();
    const clientes = this.clienteService.liste();
    const contas = this.contaService.pages(num, size);
    const merge = combineLatest([contas, clientes]).pipe(
      map(([contas, clientes]) => {
        const mapa = new Map(
          clientes.map(cliente => [cliente.id, new ClienteDe(cliente)])
        );
        const contasClientes = contas.items.map(conta => ({
            ...conta,
            cliente: mapa.get(conta.cliente)
          })
        ).map(contaCliente => new ContaClienteDe(contaCliente));
        return {
          items: contasClientes,
          page: num,
          pageSize: size,
          total: 0
        };
      })
    );
    return combineLatest([merge, all]).pipe(
      map(([merge, all]) => ({
        items: merge.items,
        page: merge.page,
        pageSize: merge.pageSize,
        total: all.length
      }))
    );
  }

  delete(id: number): Observable<ContaCliente> {
    return this.http.delete<ContaCliente>(`${env.API}/contas/${id}`);
  }
}
