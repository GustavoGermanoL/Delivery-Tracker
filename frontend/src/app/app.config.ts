import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Se seu projeto não tiver rotas, pode remover
import { provideHttpClient } from '@angular/common/http';

// 1. IMPORTE O MÓDULO E OS ÍCONES AQUI
import { LucideAngularModule, ChevronLeft, ChevronRight, Truck, Receipt, X, CalendarRange, CheckCircle, AlertCircle, Info } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
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
      Info
    }))
  ]
};