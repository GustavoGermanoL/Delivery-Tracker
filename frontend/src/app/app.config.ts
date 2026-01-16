import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <--- Importe withInterceptors
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; // <--- Importe
// 1. IMPORTE O MÓDULO E OS ÍCONES AQUI
import { LucideAngularModule, ChevronLeft, ChevronRight, Truck, Receipt, X, CalendarRange, CheckCircle, AlertCircle, Info, LogOut } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    
    // 2. REGISTRE ELES AQUI COM O importProvidersFrom
    // Isso garante que os ícones existam para O APP INTEIRO.
    importProvidersFrom(LucideAngularModule.pick({ 
      ChevronLeft, 
      ChevronRight, 
      Truck, 
      Receipt, 
      X,
      CalendarRange,
      CheckCircle, 
      AlertCircle, 
      Info,
      LogOut
    }))
  ]
};