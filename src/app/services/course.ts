import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Course {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  createCourse(courseData: any) {
    return this.http.post(this.apiUrl, courseData);
  }

  getCourses() {
    return this.http.get(this.apiUrl);
  }

  updateCourse(id: string, courseData: any) {
    return this.http.put(`${this.apiUrl}/${id}`, courseData);
  }

  deleteCourse(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}