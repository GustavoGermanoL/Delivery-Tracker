export interface WorkDay {
  date: string; // Vem como '2025-11-01' do Java
  serviceValue: number;
  reimbursementValue: number;
  reimbursementDescription?: string;
  totalDayValue: number;
  presetId?: number;
  presetColor: string; // Ex: "#00FF00"
}

export interface PeriodSummary {
  totalService: number;
  totalReimbursement: number;
  totalReceivable: number;
  days: WorkDay[];
}