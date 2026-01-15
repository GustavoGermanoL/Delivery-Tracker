import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Só o módulo básico
import { LucideAngularModule } from 'lucide-angular';
import { DayEntry, RouteType } from '../models/types';

@Component({
  selector: 'app-day-entry-drawer',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule // <--- SÓ ISSO!
  ],
  template: `
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
         (click)="onClose.emit()">
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl transition-transform duration-300 transform"
         [class.translate-y-0]="isOpen"
         [class.translate-y-full]="!isOpen">
      
      <div class="p-6 pb-8 space-y-6 max-w-md mx-auto">
        
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Editar Dia</h2>
            <p class="text-sm text-gray-500">{{ formattedDate }}</p>
          </div>
          <button (click)="onClose.emit()" class="text-gray-400 hover:text-gray-600">
            <lucide-icon name="x" class="h-6 w-6"></lucide-icon>
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tipo de Rota</label>
          <div class="grid grid-cols-2 gap-2">
            <button *ngFor="let preset of presets"
                    (click)="selectPreset(preset)"
                    class="h-14 flex flex-col items-center justify-center rounded-lg border-2 transition-all"
                    [class]="getPresetClass(preset)">
              <span class="font-semibold">{{ preset.label }}</span>
              <span class="text-xs opacity-90">R$ {{ preset.value }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Valor Manual (Override)</label>
          <div class="flex items-center gap-2 relative">
            <span class="absolute left-3 text-gray-500">R$</span>
            <input type="number" [(ngModel)]="serviceValue" 
                   class="flex-1 pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full bg-white">
          </div>
        </div>

        <div class="space-y-3 p-4 bg-gray-50 rounded-lg border">
          <label class="text-sm font-medium text-gray-700">Reembolso</label>
          <div class="flex items-center gap-2 relative">
            <span class="absolute left-3 text-gray-500">R$</span>
            <input type="number" [(ngModel)]="reimbursementValue" placeholder="0.00"
                   class="flex-1 pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full bg-white">
          </div>
          <input type="text" [(ngModel)]="reimbursementDesc" placeholder="Descrição (ex: Gasolina, Almoço)"
                 class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
        </div>

        <div class="flex gap-2 pt-2">
          <button *ngIf="entry" (click)="handleClear()" 
                  class="flex-1 py-3 border rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            Limpar
          </button>
          <button (click)="handleSave()" 
                  class="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg">
            Salvar
          </button>
        </div>

      </div>
    </div>
    `
})
export class DayEntryDrawerComponent implements OnChanges {
  // ... (código da classe continua igual)
  @Input() isOpen = false;
  @Input() selectedDate: Date | null = null;
  @Input() entry?: DayEntry;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<DayEntry>();

  selectedRoute: RouteType = null;
  serviceValue: number = 0;
  reimbursementValue: number | null = null;
  reimbursementDesc: string = '';

  presets = [
    { type: 'standard', label: 'Padrão', value: 80, colorClass: 'bg-green-500 text-white border-green-600' },
    { type: 'long', label: 'Longa', value: 140, colorClass: 'bg-amber-500 text-white border-amber-600' },
    { type: 'extra', label: 'Extra', value: 210, colorClass: 'bg-purple-500 text-white border-purple-600' },
    { type: 'dayoff', label: 'Folga', value: 0, colorClass: 'bg-gray-800 text-white border-gray-900' },
  ];

  ngOnChanges() {
    if (this.isOpen && this.selectedDate) {
      if (this.entry) {
        this.selectedRoute = this.entry.routeType;
        this.serviceValue = this.entry.serviceValue;
        this.reimbursementValue = this.entry.reimbursement?.value || null;
        this.reimbursementDesc = this.entry.reimbursement?.description || '';
      } else {
        this.resetForm();
      }
    }
  }

  get formattedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  selectPreset(preset: any) {
    this.selectedRoute = preset.type;
    this.serviceValue = preset.value;
  }

  getPresetClass(preset: any) {
    if (this.selectedRoute === preset.type) {
      return `${preset.colorClass} ring-2 ring-offset-2 ring-blue-500`;
    }
    return preset.colorClass + ' opacity-80 hover:opacity-100';
  }

  handleSave() {
    if (!this.selectedDate) return;
    const dateStr = `${this.selectedDate.getFullYear()}-${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getDate()).padStart(2, '0')}`;

    const newEntry: DayEntry = {
      date: dateStr,
      routeType: this.selectedRoute,
      serviceValue: Number(this.serviceValue),
      reimbursement: (this.reimbursementValue && this.reimbursementValue > 0) ? {
        value: Number(this.reimbursementValue),
        description: this.reimbursementDesc
      } : undefined
    };

    this.onSave.emit(newEntry);
  }

  handleClear() {
    if (!this.selectedDate) return;
    const dateStr = `${this.selectedDate.getFullYear()}-${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getDate()).padStart(2, '0')}`;
    this.onSave.emit({ date: dateStr, routeType: null, serviceValue: 0 });
  }

  resetForm() {
    this.selectedRoute = null;
    this.serviceValue = 0;
    this.reimbursementValue = null;
    this.reimbursementDesc = '';
  }
}