import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paginated } from '../../custom/paginated';
import { ContaCliente, ContaClienteDe } from '../../models/conta-cliente';
import { combineLatest, map, Observable } from 'rxjs';
import { PageResult } from '../../custom/page-result';
import { env } from '../../../../environments/env.dev';
import { Cliente, ClienteDe } from '../../models/cliente';
import { ContaService } from '../conta/conta-service';
import { Conta } from '../../models/conta';

@Injectable({
  providedIn: 'root'
})
export class ContaClienteService implements Paginated<ContaCliente> {
  private readonly http: HttpClient;
  private readonly contaService: ContaService;

  constructor(http: HttpClient, contaService: ContaService) {
    this.http = http;
    this.contaService = contaService;
  }

  pages(num: number, size: number): Observable<PageResult<ContaCliente>> {
    const all = this.http.get<Conta[]>(
      `${env.API}/contas/?page=1&pageSize=10000`
    );
    const contas = this.contaService.pages(num, size);
    const clientes = this.http.get<Cliente[]>(`${env.API}/clientes/`);
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
