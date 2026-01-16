import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; // <--- Importe
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // <--- Adicione aqui
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];