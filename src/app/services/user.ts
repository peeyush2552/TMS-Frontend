import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getUsers() {
    return this.http.get(this.apiUrl);
  }

  getEmployeesByManager(managerId: string) {
    return this.http.get(`${this.apiUrl}/manager/${managerId}/employees`);
  }

  updateUser(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}