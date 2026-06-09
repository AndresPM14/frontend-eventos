import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.config';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  login(correo: string, password: string) {
    return this.http.post<any>(`${API_URL}/auth/login`, { correo, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(payload));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  isAdmin() { return this.getUser()?.rol === 'admin'; }
}
