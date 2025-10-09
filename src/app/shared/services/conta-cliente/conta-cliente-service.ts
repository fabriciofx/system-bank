import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paginated } from '../../custom/paginated';
import { ContaCliente } from '../../models/conta-cliente';
import { combineLatest, map, Observable } from 'rxjs';
import { PageResult } from '../../custom/page-result';
import { environment } from '../../../../environments/environment.development';
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

  paginas(num: number, size: number): Observable<PageResult<ContaCliente>> {
    const all = this.http.get<Conta[]>(
      `${environment.api}/contas/?page=1&pageSize=10000`
    );
    const contas = this.contaService.paginas(num, size);
    const clientes = this.http.get<Cliente[]>(`${environment.api}/clientes/`);
    const merge = combineLatest([contas, clientes]).pipe(
      map(([contas, clientes]) => {
        const mapa = new Map(
          clientes.map(cliente => [cliente.id, new ClienteDe(cliente)])
        );
        const contasClientes = contas.items.map(conta => ({
            ...conta,
            cliente: mapa.get(conta.cliente)
          })
        );
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

  delete(id: number): Observable<object> {
    return this.http.delete(`${environment.api}/clientes/${id}`);
  }
}
