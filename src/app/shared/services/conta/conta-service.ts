import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../../../environments/env.dev';
import { map, combineLatest, Observable } from 'rxjs';
import { Conta, ContaDe } from '../../models/conta';
import { PageResult } from '../../core/page-result';
import { Paginated } from '../../core/paginated';
import { Saque } from '../../models/saque';
import { Deposito } from '../../models/deposito';
import { Transferencia } from '../../models/transferencia';

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

  pages(num: number, size: number): Observable<PageResult<Conta>> {
    const url = `${env.API}/contas/?page=${num}&pageSize=${size}`;
    const urlAll = `${env.API}/contas/?page=1&pageSize=10000`;
    const contas = this.http.get<Conta[]>(url);
    const all = this.http.get<Conta[]>(urlAll);
    const result = combineLatest([contas, all]).pipe(
      map(([contas, all]) => ({
        items: contas.map(conta => new ContaDe(conta)),
        page: num,
        pageSize: size,
        total: all.length
      }))
    );
    return result;
  }

  delete(id: number): Observable<Conta> {
    return this.http.delete<Conta>(`${env.API}/contas/${id}`);
  }

  pesquisePorId(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${env.API}/contas/${id}`);
  }

  atualize(conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${env.API}/contas/${conta.id}`, conta);
  }

  saque(saque: Saque): Observable<Saque> {
    const url = `${env.API}/contas/${saque.conta}/saque/`;
    return this.http.post<Saque>(url, saque);
  }

  deposito(deposito: Deposito): Observable<Deposito> {
    const url = `${env.API}/contas/${deposito.conta}/deposito/`;
    return this.http.post<Deposito>(url, deposito);
  }

  transferencia(transf: Transferencia): Observable<Transferencia> {
    const url = `${env.API}/contas/${transf.conta_origem}/transferencia/`;
    return this.http.post<Transferencia>(url, transf);
  }
}
