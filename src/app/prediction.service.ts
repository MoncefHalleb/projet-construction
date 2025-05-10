import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private baseUrl = 'http://127.0.0.1:5001/api/predict'; // Use 127.0.0.1 instead of localhost for better consistency

  constructor(private http: HttpClient) {}

  predict(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
}
