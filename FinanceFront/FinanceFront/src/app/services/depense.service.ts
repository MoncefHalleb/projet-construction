import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Depense } from '../models/depence';

@Injectable({
  providedIn: 'root',
})
export class DepenseService {
  private subject = new Subject<any>();
  constructor(public httpClient: HttpClient) {}

  private baseUrl = 'http://localhost:8081/api/depenses/';

  public getAllProject(): Observable<Depense> {
    return this.httpClient.get<Depense>(this.baseUrl + 'allProject');
  }

  public getAllByProject(id: any): Observable<Depense> {
    return this.httpClient.get<Depense>(this.baseUrl + 'findByProject/' + id);
  }
  public add(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + 'add', data);
  }

  public update(id:any, data: any): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + 'update/'+id, data);
  }

  uploadFile(file: File, id: number): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.post(`${this.baseUrl}upload/${id}`, formData, {
      responseType: 'text',
    });
  }

  getFile(id: number) {
    return this.httpClient.get(this.baseUrl + 'getfile/' + id, {
      responseType: 'blob', // Pour récupérer le fichier sous forme de Blob
    });
  }

  public edit(id: number, data: any): Observable<Depense> {
    return this.httpClient.put<Depense>(this.baseUrl + 'update/' + id, data);
  }
  public delete(id: any): Observable<Depense> {
    return this.httpClient.delete<Depense>(this.baseUrl + id);
  }

  public getById(id: any): Observable<Depense> {
    return this.httpClient.get<Depense>(this.baseUrl + id);
  }

  searchDepenses(param: string): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'search', { params: { param } });
  }
}
