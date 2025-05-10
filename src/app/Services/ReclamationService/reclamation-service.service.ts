import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private baseUrl = 'http://localhost:8088/api/services/reclamation'

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
  uploadReclamationFile(file: File, reclamationId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reclamationId', reclamationId.toString());
  
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
  addReclamationWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addWithFile`, formData);
  }

  findById(id: number): Observable<any> {
    const getUrl = `${this.baseUrl}/${id}`;
    return this.http.get(getUrl);
  }
  getReclamationStatistics(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/statistics`);
  }
  // 🟢 Récupérer la note admin générée par l’IA
getAdminNote(id: number): Observable<string> {
  return this.http.get(`${this.baseUrl}/${id}/admin-note`, { responseType: 'text' });
}

// 🟢 Modifier le statut de la réclamation (ex: TRAITEE, ESCALATED...)
updateStatut(id: number, statut: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/${id}/statut?statut=${statut}`, {});
}

}
