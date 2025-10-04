import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = `${environment.api}/token/` ;

  constructor(private clienteHttp: HttpClient, private router: Router) { }

  login(data: Auth) {
    return this.clienteHttp.post(this.api, data).subscribe(
      {
        next: (response) => {
          localStorage.setItem('access_token', (response as any).access);
          localStorage.setItem('refresh_token', (response as any).refresh);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login error', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuário e/ou senha inválidos!',
          });
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth']);
  }

  refreshToken(refresh: string) {
    return this.clienteHttp.post(`${this.api}refresh/`, { refresh });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
