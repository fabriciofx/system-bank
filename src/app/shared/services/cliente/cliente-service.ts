import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { env } from '../../../../environments/env.dev';
import { PageResult } from '../../core/page-result';
import { Paginated } from '../../core/paginated';
import { Cliente, ClienteDe } from '../../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements Paginated<Cliente> {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  insere(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${env.API}/clientes/`, cliente);
  }

  liste(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${env.API}/clientes/`);
  }

  pages(num: number, size: number): Observable<PageResult<Cliente>> {
    const url = `${env.API}/clientes/?page=${num}&pageSize=${size}`;
    const clientes = this.http.get<Cliente[]>(url);
    const all = this.liste();
    const result = combineLatest([clientes, all]).pipe(
      map(([clientes, all]) => ({
        items: clientes.map((cliente) => new ClienteDe(cliente)),
        page: num,
        pageSize: size,
        total: all.length
      }))
    );
    return result;
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${env.API}/clientes/${id}`);
  }

  pesquisePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${env.API}/clientes/${id}`);
  }

  atualize(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${env.API}/clientes/${cliente.id}/`,
      cliente
    );
  }
}
