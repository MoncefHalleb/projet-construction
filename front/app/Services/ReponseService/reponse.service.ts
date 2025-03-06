import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private baseUrl = 'http://localhost:9090/api/services/reponse'


  constructor(private http:HttpClient) { }

  addReponse(reponse: any, idReclamation: number): Observable<any> {
    return this.http.post(`${this.baseUrl}?idReclamation=${idReclamation}`, reponse);
  }
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/findAll`);
  }
  deleteReponse(id: number) {
    const deleteUrl = `${this.baseUrl}/${id}`;
    return this.http.delete(deleteUrl);
  }
  updateReponse(id: number, updateReponse: any): Observable<any> {
    const updateUrl = `${this.baseUrl}/${id}`;
    return this.http.put(updateUrl, updateReponse);
  }
  findById(id: number): Observable<any> {
    const getUrl = `${this.baseUrl}/${id}`;
    return this.http.get(getUrl);
  }
}
