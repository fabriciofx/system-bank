import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Cliente } from '../../models/cliente';
import { PageResult } from '../../custom/page-result';
import { Paginated } from '../../custom/paginated';

@Injectable({
  providedIn: 'root'
})
export class ClienteService implements Paginated<Cliente> {
  private readonly http: HttpClient;
  private readonly api:string = `${environment.api}/clientes`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  insere(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.api}/`, cliente);
  }

  liste(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  paginas(num: number, size: number): Observable<PageResult<Cliente>> {
    const url = `${this.api}/?page=${num}&pageSize=${size}`;
    const urlAll = `${this.api}/?page=1&pageSize=10000`;
    const clientes = this.http.get<Cliente[]>(url);
    const all = this.http.get<Cliente[]>(urlAll);
    const result = combineLatest([clientes, all]).pipe(
      map(([clientes, all]) => ({
        items: clientes,
        page: num,
        pageSize: size,
        total: all.length
      }))
    );
    return result;
  }

  delete(id: number): Observable<object> {
    return this.http.delete(`${this.api}/${id}`)
  }

  pesquisaPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  atualize(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.api}/${cliente.id}/`, cliente);
  }
}
