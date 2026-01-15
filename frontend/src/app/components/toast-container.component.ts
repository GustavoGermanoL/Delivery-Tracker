import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300 transform transition-all"
           [ngClass]="{
             'bg-green-600 text-white': toast.type === 'success',
             'bg-red-600 text-white': toast.type === 'error',
             'bg-blue-600 text-white': toast.type === 'info'
           }">
        
        <lucide-icon *ngIf="toast.type === 'success'" name="check-circle" class="w-5 h-5"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'error'" name="alert-circle" class="w-5 h-5"></lucide-icon>
        <lucide-icon *ngIf="toast.type === 'info'" name="info" class="w-5 h-5"></lucide-icon>

        <span class="font-medium text-sm flex-1">{{ toast.message }}</span>

        <button (click)="toastService.remove(toast.id)" class="opacity-80 hover:opacity-100">
          <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}