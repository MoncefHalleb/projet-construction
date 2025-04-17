import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaiementService {
  private baseUrl = 'http://localhost:8081/api/paiements';
  constructor(public httpClient: HttpClient) {}

  createPaymentIntent(data: any): Observable<{ clientSecret: string }> {
    return this.httpClient.post<{ clientSecret: string }>(
      this.baseUrl + '/create-payment-intent',
      data
    );
  }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }
}
