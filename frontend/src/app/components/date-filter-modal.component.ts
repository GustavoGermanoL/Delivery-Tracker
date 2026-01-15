import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-date-filter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div class="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <lucide-icon name="calendar-range" class="w-5 h-5"></lucide-icon>
            Filtrar Período
          </h3>
          <button (click)="onClose.emit()" class="text-white/80 hover:text-white">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <div class="p-6 space-y-4">
          
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Data Inicial</label>
            <input type="date" [(ngModel)]="startDate" 
                   class="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Data Final</label>
            <input type="date" [(ngModel)]="endDate" 
                   class="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <div class="flex gap-3 pt-2">
            <button (click)="limparFiltro()" 
                    class="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
              Limpar
            </button>
            <button (click)="aplicarFiltro()" 
                    class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
              Filtrar
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class DateFilterModalComponent {
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onApply = new EventEmitter<{start: string, end: string}>();
  @Output() onClear = new EventEmitter<void>();

  startDate: string = '';
  endDate: string = '';

  aplicarFiltro() {
    if (this.startDate && this.endDate) {
      this.onApply.emit({ start: this.startDate, end: this.endDate });
    } else {
      alert('Selecione as duas datas!');
    }
  }

  limparFiltro() {
    this.startDate = '';
    this.endDate = '';
    this.onClear.emit();
  }
}