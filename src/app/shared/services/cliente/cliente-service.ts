import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Cliente } from '../../models/cliente';
import { PageResult } from '../../page/page-result';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
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

  paginas(num: number, size: number): Observable<Cliente[]> {
    const url:string = `${this.api}/?page=${num}&pageSize=${size}`;
    return this.http.get<Cliente[]>(url);
  }

  paginas2(num: number, size: number): Observable<PageResult<Cliente>> {
    const url = `${this.api}/?page=${num}&pageSize=${size}`;
    const urlAll = `${this.api}/?page=1&pageSize=10000`;
    const contas = this.http.get<Cliente[]>(url);
    const all = this.http.get<Cliente[]>(urlAll);
    const result = combineLatest([contas, all]).pipe(
      map(([contas, all]) => ({
        items: contas,
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
