import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  constructor(public httpClient: HttpClient) {}

  private baseUrl = 'http://localhost:8081/api/factures';

  public add(id: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/save/' + id, null);
  }

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl);
  }

  downloadFacturePdf(factureId: number): Observable<Blob> {
    return this.httpClient.get(this.baseUrl + '/download/' + factureId, {
      responseType: 'blob',
    });
  }
}
