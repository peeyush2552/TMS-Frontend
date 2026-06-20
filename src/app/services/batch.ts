import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  private apiUrl = `${environment.apiUrl}/batches`;

  constructor(private http: HttpClient) {}

  createBatch(batchData: any): Observable<any> {
    return this.http.post(this.apiUrl, batchData);
  }

  getBatches(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBatchById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateBatch(id: string, batchData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, batchData);
  }

  cancelBatch(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {});
  }
}