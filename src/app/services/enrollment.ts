import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Enrollment {
  private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) {}

  // Employee methods
  createEnrollment(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getEmployeeEnrollments(employeeId: string) {
    return this.http.get(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Manager methods
  getManagerPendingApprovals(managerId: string) {
    return this.http.get(`${this.apiUrl}/manager/${managerId}/pending`);
  }

  getManagerApprovals(managerId: string) {
    return this.http.get(`${this.apiUrl}/manager/${managerId}`);
  }

  getManagerEnrollments(managerId: string) {
    return this.http.get(`${this.apiUrl}/manager/${managerId}`);
  }

  approveEnrollment(id: string, comments: string) {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, { comments });
  }

  rejectEnrollment(id: string, comments: string) {
    return this.http.patch(`${this.apiUrl}/${id}/reject`, { comments });
  }
}
