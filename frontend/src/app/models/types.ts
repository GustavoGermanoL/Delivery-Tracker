export type RouteType = 'standard' | 'long' | 'extra' | 'dayoff' | null;

export interface DayEntry {
  date: string; // YYYY-MM-DD
  routeType: RouteType;
  serviceValue: number;
  reimbursement?: {
    value: number;
    description: string;
  };
}