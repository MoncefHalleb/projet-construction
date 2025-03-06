import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private baseUrl = 'http://localhost:9090/api/services/reclamation'

  constructor(private http:HttpClient) { }

  addReclamation(reclamation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, reclamation)
  }
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findAll`);
  }
  deleteReclamation(id: number) {
    const deleteUrl = `${this.baseUrl}/${id}`;
    return this.http.delete(deleteUrl);
  }
  updateReclamation(id: number, updatedReclamation: any): Observable<any> {
    const updateUrl = `${this.baseUrl}/${id}`;
    return this.http.put(updateUrl, updatedReclamation);
  }
  findById(id: number): Observable<any> {
    const getUrl = `${this.baseUrl}/${id}`;
    return this.http.get(getUrl);
  }
  getReclamationStatistics(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/statistics`);
  }
}
