import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-300">
        
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Crie sua Conta 🚀</h1>
          <p class="text-gray-500">Comece a controlar seus ganhos hoje</p>
        </div>

        <form (submit)="onSubmit()" class="space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" [(ngModel)]="name" name="name" required
                   placeholder="Ex: João da Silva"
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   placeholder="seu@email.com"
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   placeholder="Mínimo 6 caracteres"
                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          </div>

          <button type="submit" [disabled]="isLoading"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {{ isLoading ? 'Criando conta...' : 'Cadastrar' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta? 
          <a routerLink="/login" class="text-blue-600 font-bold hover:underline">Faça Login</a>
        </div>

      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit() {
    // Validação básica no front
    if (this.password.length < 3) {
      this.toast.show('A senha precisa ser maior', 'error');
      return;
    }

    this.isLoading = true;

    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.show('Conta criada com sucesso!', 'success');
        // Redireciona para o login para a pessoa entrar
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        
        // Tratamento de erro (ex: Email já existe)
        if (err.status === 400) {
          this.toast.show('Este email já está cadastrado.', 'error');
        } else {
          this.toast.show('Erro ao criar conta. Tente novamente.', 'error');
        }
      }
    });
  }
}