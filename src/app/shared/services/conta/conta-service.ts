import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Conta } from '../../models/conta';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private readonly http: HttpClient;
  private readonly api:string = `${environment.api}/contas/`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  insere(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(
      this.api,
      conta
    );
  }

  liste(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.api);
  }

  paginas(num: number, size: number): Observable<Conta[]> {
    const url:string = `${this.api}/?page=${num}&pageSize=${size}`;
    return this.http.get<Conta[]>(url);
  }

  delete(id: number): Observable<object> {
    return this.http.delete(`${this.api}/${id}`)
  }

  pesquisaPorId(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.api}/${id}`);
  }

  atualize(conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.api}/${conta.id}`, conta);
  }
}
