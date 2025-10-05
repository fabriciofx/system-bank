import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { environment } from '../../../../environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router: Router;
  private readonly http: HttpClient;
  private readonly api = `${environment.api}/token/` ;

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  login(auth: Auth) {
    return this.http.post(this.api, auth).subscribe(
      {
        next: (response) => {
          localStorage.setItem('access_token', (response as any).access);
          localStorage.setItem('refresh_token', (response as any).refresh);
          this.router.navigate(['/cliente']);
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.router.navigate(['/auth']);
  }

  refreshToken(refresh: string) {
    return this.http.post(`${this.api}refresh/`, { refresh });
  }

  getRefresh(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
