import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeriodSummary } from '../models/work-day.model';
import { environment } from '../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class WorkDayService {
  private apiUrl = `${environment.apiUrl}/api/work-days`;

  constructor(private http: HttpClient) { }

  getSummary(start: string, end: string): Observable<PeriodSummary> {
    const params = new HttpParams().set('start', start).set('end', end);
    return this.http.get<PeriodSummary>(`${this.apiUrl}/summary`, { params });
  }

  save(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}