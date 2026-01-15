import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DayEntry } from '../models/types';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="bg-blue-600 text-white pb-8 pt-6 px-4 rounded-b-3xl shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <button (click)="previousMonth.emit()" class="p-2 hover:bg-blue-500 rounded-full transition-colors">
          <lucide-icon name="chevron-left" class="h-6 w-6"></lucide-icon>
        </button>
        
        <h1 class="text-lg font-semibold capitalize">{{ monthName }}</h1>
        
        <button (click)="nextMonth.emit()" class="p-2 hover:bg-blue-500 rounded-full transition-colors">
          <lucide-icon name="chevron-right" class="h-6 w-6"></lucide-icon>
        </button>
      </div>

      <div class="text-center mb-6">
        <p class="text-blue-200 text-sm mb-1">A Receber Total</p>
        <p class="text-4xl font-bold tracking-tight">
          {{ (totalReceivable !== undefined ? totalReceivable : 0) | currency:'BRL' }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-blue-500/50 rounded-xl py-3 px-3 border border-blue-400/30 flex items-center gap-2">
          <div class="rounded-full bg-blue-400 p-2">
            <lucide-icon name="truck" class="h-4 w-4 text-white"></lucide-icon>
          </div>
          <div>
            <p class="text-xs text-blue-200">Diárias</p>
            <p class="text-lg font-bold leading-tight">{{ totalService | currency:'BRL' }}</p>
          </div>
        </div>

        <div class="bg-blue-500/50 rounded-xl py-3 px-3 border border-blue-400/30 flex items-center gap-2">
          <div class="rounded-full bg-blue-400 p-2">
            <lucide-icon name="receipt" class="h-4 w-4 text-white"></lucide-icon>
          </div>
          <div>
            <p class="text-xs text-blue-200">Reembolsos</p>
            <p class="text-lg font-bold leading-tight">{{ totalReimbursement | currency:'BRL' }}</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class DashboardHeaderComponent {
  @Input() currentDate!: Date;
  @Input() entries: DayEntry[] = [];
  
  // AQUI ESTÁ A CORREÇÃO: Recebe os valores prontos, não calcula!
  @Input() totalReceivable: number = 0;
  @Input() totalService: number = 0;
  @Input() totalReimbursement: number = 0;

  @Output() previousMonth = new EventEmitter<void>();
  @Output() nextMonth = new EventEmitter<void>();

  get monthName(): string {
    if (!this.currentDate) return '';
    return this.currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }
}