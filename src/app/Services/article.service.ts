import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../models/Article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://localhost:8088/api/articles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  create(article: Article, file?: File): Observable<Article> {
    const formData = new FormData();
    formData.append('name', article.name);
    formData.append('description', article.description || '');
    formData.append('price', article.price.toString());
    formData.append('stock', article.stock.toString());
    formData.append('type', article.type);

    if (file) {
      formData.append('file', file); // Must match @RequestParam("file")!
    }

    return this.http.post<Article>(`${this.apiUrl}/add`, formData);
  }

  update(id: number, article: Article, file?: File): Observable<Article> {
    const formData = new FormData();

    formData.append('name', article.name);
    formData.append('description', article.description || '');
    formData.append('price', article.price.toString());
    formData.append('stock', article.stock.toString());
    formData.append('type', article.type);

    if (file) {
      formData.append('file', file);
    }

    return this.http.put<Article>(`${this.apiUrl}/update/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    type?: string
  ): Observable<Article[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (minPrice != null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice != null) params = params.set('maxPrice', maxPrice.toString());
    if (type) params = params.set('type', type);

    return this.http.get<Article[]>(`${this.apiUrl}/search`, { params });
  }

  getBestSelling(limit: number = 3): Observable<Article[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Article[]>(`${this.apiUrl}/best-selling`, { params });
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
    });
  }

  importFromExcel(file: File): Observable<Article[]> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Article[]>(`${this.apiUrl}/import`, formData);
  }

  generateArticleDescription(id: number) {
    return this.http.get<{ message: string }>(
      `${this.apiUrl}/generate-description/${id}`
    );
  }

  chatbot(payload: { message: string }) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/chat`, payload);
  }
}
