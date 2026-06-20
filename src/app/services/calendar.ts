import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Calendar {
  private apiUrl = `${environment.apiUrl}/calendars`;

  constructor(private http: HttpClient) {}

  createCalendar(calendarData: any) {
    return this.http.post(this.apiUrl, calendarData);
  }

  getCalendars() {
    return this.http.get(this.apiUrl);
  }

  updateCalendar(id: string, calendarData: any) {
    return this.http.put(`${this.apiUrl}/${id}`, calendarData);
  }

  deleteCalendar(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}