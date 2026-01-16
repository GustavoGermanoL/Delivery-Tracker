import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardHeaderComponent } from '../../components/dashboard-header.component';
import { CalendarGridComponent } from '../../components/calendar-grid.component';
import { DayEntryDrawerComponent } from '../../components/day-entry-drawer.component';
// 1. IMPORTAR O NOVO MODAL
import { DateFilterModalComponent } from '../../components/date-filter-modal.component'; 
import { DayEntry, RouteType } from '../../models/types';
import { WorkDayService } from '../../services/work-day.service';
import { ToastContainerComponent } from '../../components/toast-container.component';
import { ToastService } from '../../services/toast.service'; // Importe o serviço
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    DashboardHeaderComponent, 
    CalendarGridComponent, 
    DayEntryDrawerComponent,
    DateFilterModalComponent, // <--- 2. ADICIONAR AOS IMPORTS
    ToastContainerComponent
  ],
  template: `

    <main class="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl relative flex flex-col">
      <app-toast-container></app-toast-container>
      <div class="bg-blue-600 px-4 pt-4 pb-0 flex justify-between">

        

        <button (click)="isFilterOpen = true" 
                class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-blue-500 shadow-sm">
          <lucide-icon name="calendar-range" class="w-4 h-4"></lucide-icon>
          {{ isFilterActive ? 'Filtro Ativo' : 'Filtrar' }}
        </button>

        <button (click)="logout()" 
                class="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group">
          <lucide-icon name="log-out" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></lucide-icon>
          <span class="text-sm font-medium">Sair</span>
        </button>
        
      </div>

      <app-dashboard-header
        [currentDate]="currentDate"
        [entries]="entries"
        [totalReceivable]="summaryTotals.receivable"
        [totalService]="summaryTotals.service"
        [totalReimbursement]="summaryTotals.reimbursement"
        (previousMonth)="onPrevMonth()"
        (nextMonth)="onNextMonth()">
      </app-dashboard-header>

      <div *ngIf="isFilterActive" class="bg-amber-100 px-4 py-2 text-center text-xs text-amber-800 border-b border-amber-200 font-medium flex justify-between items-center">
        <span>Exibindo: {{ filterRangeLabel }}</span>
        <button (click)="handleClearFilter()" class="underline text-amber-900">Limpar</button>
      </div>

      <app-calendar-grid
        [currentDate]="currentDate"
        [entries]="entries"
        (onDayClick)="onDayClick($event)">
      </app-calendar-grid>

      <app-day-entry-drawer
        [isOpen]="isDrawerOpen"
        [selectedDate]="selectedDate"
        [entry]="getSelectedEntry()"
        (onClose)="isDrawerOpen = false"
        (onSave)="onSaveEntry($event)">
      </app-day-entry-drawer>

      <app-date-filter-modal
        [isOpen]="isFilterOpen"
        (onClose)="isFilterOpen = false"
        (onApply)="handleApplyFilter($event)"
        (onClear)="handleClearFilter()">
      </app-date-filter-modal>

    </main>
  `
})
export class DashboardComponent implements OnInit {
  currentDate = new Date(); 
  entries: DayEntry[] = [];
  summaryTotals = { receivable: 0, service: 0, reimbursement: 0 };
  
  selectedDate: Date | null = null;
  isDrawerOpen = false;
  
  // ESTADO DO FILTRO
  isFilterOpen = false;
  isFilterActive = false;
  filterRangeLabel = '';

  constructor(
    private workDayService: WorkDayService,
    private cdr: ChangeDetectorRef ,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData(); // Carrega o mês atual por padrão
  }

  // --- NAVEGAÇÃO MENSAL (Só funciona se não tiver filtro) ---
  onPrevMonth() {
    if (this.isFilterActive) this.handleClearFilter(); // Remove filtro se mudar mês
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.loadData();
  }

  onNextMonth() {
    if (this.isFilterActive) this.handleClearFilter();
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.loadData();
  }

  // --- LÓGICA DE CARREGAMENTO INTELIGENTE ---
  
  // 1. Carrega Mês Padrão
  loadData() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    
    const start = `${year}-${month.toString().padStart(2, '0')}-01`;
    const end = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

    this.fetchData(start, end);
  }

  // 2. Aplica Filtro Personalizado
  handleApplyFilter(range: { start: string, end: string }) {
    this.isFilterActive = true;
    this.isFilterOpen = false;
    
    // Formata data bonitinha para mostrar na tarja amarela
    const startObj = new Date(range.start + 'T12:00:00'); // Fix timezone
    const endObj = new Date(range.end + 'T12:00:00');
    this.filterRangeLabel = `${startObj.getDate()}/${startObj.getMonth()+1} até ${endObj.getDate()}/${endObj.getMonth()+1}`;

    // Atualiza a currentDate para o mês do início do filtro (para o calendário ir pra lá)
    this.currentDate = new Date(startObj.getFullYear(), startObj.getMonth(), 1);

    this.fetchData(range.start, range.end);
  }

  // 3. Limpa Filtro
  handleClearFilter() {
    this.isFilterActive = false;
    this.isFilterOpen = false;
    this.loadData(); // Volta para o mês inteiro
  }

  // 4. Função Genérica que busca no Backend
  fetchData(start: string, end: string) {
    this.summaryTotals = { receivable: 0, service: 0, reimbursement: 0 };
    this.entries = []; // Limpa para dar feedback visual
    this.cdr.detectChanges();

    console.log(`📡 Buscando Período: ${start} até ${end}`);

    this.workDayService.getSummary(start, end).subscribe({
      next: (data) => {
        console.log('✅ Dados Filtrados:', data);
        
        this.summaryTotals = {
          receivable: data.totalReceivable || 0,
          service: data.totalService || 0,
          reimbursement: data.totalReimbursement || 0
        };

        this.entries = (data.days || []).map((d: any) => ({
          date: d.date.substring(0, 10), 
          serviceValue: d.serviceValue,
          routeType: this.mapIdToRouteType(d.presetId), 
          reimbursement: d.reimbursementValue > 0 ? {
            value: d.reimbursementValue,
            description: d.reimbursementDescription
          } : undefined
        }));

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('❌ Erro:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // ... (MANTENHA OS MÉTODOS DE MAP, SAVE E CLICK EXATAMENTE IGUAIS) ...
  onDayClick(date: Date) {
    this.selectedDate = date;
    this.isDrawerOpen = true;
  }

  getSelectedEntry(): DayEntry | undefined {
    if (!this.selectedDate) return undefined;
    const dateStr = this.formatDate(this.selectedDate);
    return this.entries.find(e => e.date === dateStr);
  }

  onSaveEntry(newEntry: DayEntry) {
    const payload = {
      date: newEntry.date,
      presetId: newEntry.routeType ? this.mapRouteTypeToId(newEntry.routeType) : null,
      manualValue: newEntry.serviceValue,
      reimbursementValue: newEntry.reimbursement?.value || 0,
      reimbursementDescription: newEntry.reimbursement?.description || ''
    };

    this.workDayService.save(payload).subscribe({
      next: () => {
        // 1. FECHA A GAVETA IMEDIATAMENTE
        this.isDrawerOpen = false; 

        // 2. MOSTRA O TOAST
        this.toastService.show('Salvo com sucesso!', 'success');

        // 3. RECARREGA OS DADOS
        if (this.isFilterActive) {
             this.loadData(); 
             this.isFilterActive = false; 
        } else {
            this.loadData();
        }
        
        // 4. FORÇA A ATUALIZAÇÃO VISUAL (Importante!)
        // Isso garante que o Angular perceba que isDrawerOpen mudou para false
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.toastService.show('Erro ao salvar.', 'error');
        this.cdr.detectChanges(); // Atualiza também em caso de erro
      }
    });
  }

  logout() {
     this.authService.logout();
   }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  mapRouteTypeToId(type: RouteType): number | null {
    switch (type) {
      case 'standard': return 6; 
      case 'long': return 7;     
      case 'extra': return 8;    
      case 'dayoff': return 9;   
      default: return null;
    }
  }

  mapIdToRouteType(id: number): RouteType {
    switch (id) {
      case 1: return 'standard';
      case 6: return 'standard'; 
      case 7: return 'long';     
      case 8: return 'extra';    
      case 9: return 'dayoff';   
      default: return null; 
    }
  }
}