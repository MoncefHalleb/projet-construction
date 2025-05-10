import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Etude {
  id?: number;
  title: string;
  description: string;
  studyDate: string;
  documents: string;
  typeEtude: string;
  topographie: string;
  dateDeRealisation: string;
}

export interface Project {

  id?: number;
  name: string;
  location: string;
  description: string;
  documents?: string;  // ✅ Fix: Ensure documents is optional
  status: string;
  startDate: string;
  endDate: string;
  images?: string;  // ✅ Fix: Ensure images is optional
  latitude?: number;
  longitude?: number;

}



@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // New method for weather
  getWeather(
    city: string
  ): Observable<{ city: string; temperature: number; description: string }> {
    return this.http.get<{
      city: string;
      temperature: number;
      description: string;
    }>(`${this.weatherUrl}/${city}`);
  }
  private apiUrlEtudes = 'http://localhost:8088/api/etudes';
  private apiUrlProjects = 'http://localhost:8088/api/projects';
  private weatherUrl = 'http://localhost:8088/api/weather'; // Backend URL for weather

  constructor(private http: HttpClient) {}

  // ✅ Get all Etudes
  getEtudes(): Observable<Etude[]> {
    return this.http.get<Etude[]>(this.apiUrlEtudes);
  }

  // ✅ Get Etude by ID
  getEtudeById(id: number): Observable<Etude> {
    return this.http.get<Etude>(`${this.apiUrlEtudes}/${id}`);
  }

  // ✅ Create a new Etude (Fixed URL)
  createEtude(formData: FormData): Observable<Etude> {
    return this.http.post<Etude>(this.apiUrlEtudes, formData);
  }

  updateEtude(id: number, formData: FormData): Observable<Etude> {
    return this.http.put<Etude>(`${this.apiUrlEtudes}/${id}`, formData);
  }

  // ✅ Delete an Etude
  deleteEtude(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlEtudes}/${id}`);
  }
  downloadEtudeFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrlEtudes}/${fileName}/download`, {
      responseType: 'blob',
    });
  }

  // ✅ Get all Projects
  getProjects(
    query: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrlProjects}/search`, { params });
  }
  getEtudesPaginated(
    searchQuery: string,
    sortBy: string,
    sortDirection: string,
    currentPage: number,
    pageSize: number
  ) {
    // Implement the method logic here
    // Example:
    return this.http.get<any>(`/api/etudes`, {
      params: {
        searchQuery,
        sortBy,
        sortDirection,
        currentPage: currentPage.toString(),
        pageSize: pageSize.toString(),
      },
    });
  }

  // ✅ Get Project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrlProjects}/${id}`);
  }

  // ✅ Create a new Project
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(
      'http://localhost:8088/api/projects',
      project,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  // ✅ Update an existing Project
  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrlProjects}/${id}`, project, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), // ✅ Ensure JSON is sent
    });
  }

  // ✅ Delete a Project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProjects}/${id}`);
  }
  uploadProject(
    selectedProject: Project,
    selectedFile: File,
    formData: FormData
  ): Observable<any> {
    return this.http.post(`${this.apiUrlProjects}/upload`, formData);
  }
}
