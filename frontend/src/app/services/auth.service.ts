import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Ajuste se necessário

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {email: string, password: string}) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Salva o token no navegador
        localStorage.setItem('auth-token', response.token);
      })
    );
  }

  register(user: {name: string, email: string, password: string}) {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('auth-token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Retorna true se tiver token
  }
}