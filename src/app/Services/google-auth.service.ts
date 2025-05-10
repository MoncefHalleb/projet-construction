import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private apiUrl = 'http://localhost:8080/api/auth/google';

  constructor(private http: HttpClient) {}

  getAuthUrl(): Observable<string> {
    return this.http.get(this.apiUrl + '/login', { responseType: 'text' });
  }
}