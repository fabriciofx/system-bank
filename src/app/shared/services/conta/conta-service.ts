import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../../environments/env.dev';
import { map, combineLatest, Observable } from 'rxjs';
import { Conta } from '../../models/conta';
import { PageResult } from '../../custom/page-result';
import { Paginated } from '../../custom/paginated';

@Injectable({
  providedIn: 'root'
})
export class ContaService implements Paginated<Conta> {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  insere(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(`${env.API}/contas/`, conta);
  }

  liste(): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${env.API}/contas/`);
  }

  paginas(num: number, size: number): Observable<PageResult<Conta>> {
    const url = `${env.API}/contas/?page=${num}&pageSize=${size}`;
    const urlAll = `${env.API}/contas/?page=1&pageSize=10000`;
    const contas = this.http.get<Conta[]>(url);
    const all = this.http.get<Conta[]>(urlAll);
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
    return this.http.delete(`${env.API}/contas/${id}`)
  }

  pesquisaPorId(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${env.API}/contas/${id}`);
  }

  atualize(conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${env.API}/contas/${conta.id}`, conta);
  }
}
