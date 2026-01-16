import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Delivery Tracker 🛵</h1>
          <p class="text-gray-500">Entre para gerenciar seus ganhos</p>
        </div>

        <form (submit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <button type="submit" [disabled]="isLoading"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Não tem conta? 
          <a routerLink="/register" class="text-blue-600 font-bold hover:underline">Cadastre-se</a>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast.show('Login realizado!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.show('Email ou senha inválidos', 'error');
        this.isLoading = false;
      }
    });
  }
}