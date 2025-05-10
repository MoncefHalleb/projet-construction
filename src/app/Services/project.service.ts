import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrlProjects = 'http://localhost:8088/api/projects';
  private authUrl = 'http://localhost:8088/api/auth/google';

  constructor(private http: HttpClient) {}

  getProjects(
    searchQuery: string = '',
    sortBy: string = 'nomProjet',
    order: string = 'asc'
  ): Observable<Project[]> {
    let params = new HttpParams()
      .set('search', searchQuery)
      .set('sortBy', sortBy)
      .set('order', order);

    return this.http.get<Project[]>(this.apiUrlProjects, { params });
  }

  // Fetch Google authorization URL
  getGoogleAuthUrl(): Observable<string> {
    return this.http.get(`${this.authUrl}/login`, { responseType: 'text' });
  }

  // ✅ Create a new Project
  createProject(project: Project, file?: File): Observable<Project> {
    const formData = new FormData();
    formData.append('nomProjet', project.nomProjet);
    formData.append('location', project.location);
    formData.append('status', project.status);
    formData.append('startDate', project.startDate);
    formData.append('endDate', project.endDate);

    // ✅ Fix: Append file only if it exists
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Project>(this.apiUrlProjects, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' }),
    });
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrlProjects}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProjects}/${id}`);
  }

  // Optional: If you want to support file uploads later
  uploadProject(project: Project, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nomProjet', project.nomProjet);
    formData.append('location', project.location);
    formData.append('status', project.status);
    formData.append('startDate', project.startDate);
    formData.append('endDate', project.endDate);
    if (project.description)
      formData.append('description', project.description);
    if (file) formData.append('file', file);
    return this.http.post(`${this.apiUrlProjects}/upload`, formData);
  }
}
