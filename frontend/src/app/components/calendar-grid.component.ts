import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayEntry, RouteType } from '../models/types';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
  
    <div class="px-4 py-6">
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div *ngFor="let day of weekDays" class="text-center text-xs font-medium text-gray-500">
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-2">
        <ng-container *ngFor="let date of days">
          <div *ngIf="!date" class="aspect-square"></div>

          <button
            *ngIf="date"
            (click)="onDayClick.emit(date)"
            class="aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative transition-transform active:scale-95 border"
            [ngClass]="getRouteColor(getEntryForDate(date)?.routeType)"
          >
            {{ date.getDate() }}
            
            <span *ngIf="hasReimbursement(date)" 
                  class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white">
            </span>
          </button>
        </ng-container>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-2 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-green-500"></span>
          <span class="text-gray-600">Padrão</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-amber-500"></span>
          <span class="text-gray-600">Longa</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-purple-500"></span>
          <span class="text-gray-600">Extra/Domingo</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-4 rounded bg-gray-800"></span>
          <span class="text-gray-600">Folga</span>
        </div>
      </div>
    </div>
  `
})
export class CalendarGridComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() entries: DayEntry[] = [];
  @Output() onDayClick = new EventEmitter<Date>();

  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  days: (Date | null)[] = [];

  ngOnChanges() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    this.days = [];
    
    // Empty slots
    for (let i = 0; i < startDayOfWeek; i++) {
      this.days.push(null);
    }
    
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(new Date(year, month, i));
    }
  }

  getEntryForDate(date: Date): DayEntry | undefined {
    // Formata localmente YYYY-MM-DD
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return this.entries.find(e => e.date === dateStr);
  }

  hasReimbursement(date: Date): boolean {
    const entry = this.getEntryForDate(date);
    return !!(entry?.reimbursement && entry.reimbursement.value > 0);
  }

  getRouteColor(type?: RouteType): string {
    switch (type) {
      case 'standard': return 'bg-green-500 text-white border-green-600';
      case 'long': return 'bg-amber-500 text-white border-amber-600';
      case 'extra': return 'bg-purple-500 text-white border-purple-600';
      case 'dayoff': return 'bg-gray-800 text-white border-gray-900';
      default: return 'bg-white text-gray-900 border-gray-200';
    }
  }
}