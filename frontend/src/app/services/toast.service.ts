import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]); // Usando Signals do Angular moderno

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    
    // Adiciona na lista
    this.toasts.update(current => [...current, newToast]);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}