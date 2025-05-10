import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUrl = 'http://localhost:8088/files';

  constructor(private http: HttpClient) {}

  uploadFileToGoogleDrive(
    file: File,
    type: string,
    idUser: number
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.apiUrl}/uploadToGoogleDrive/${idUser}?type=${type}`,
      formData
    );
  }

  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}