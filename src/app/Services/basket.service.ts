// basket.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Basket } from '../../models/Basket';
import { BasketItem } from '../front/articles/articles.component'; // Adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private apiUrl = 'http://localhost:8088/basket';

  private currentBasketId: number | null = null;
  private currentItems: BasketItem[] = [];

  constructor(private http: HttpClient) {
    this.loadFromStorage(); // ✅ load on service init
  }

  // ✅ Persistence Logic
  private loadFromStorage(): void {
    const id = localStorage.getItem('basketId');
    const items = localStorage.getItem('basketItems');
    if (id) this.currentBasketId = +id;
    if (items) this.currentItems = JSON.parse(items);
  }

  private saveToStorage(): void {
    if (this.currentBasketId !== null) {
      localStorage.setItem('basketId', this.currentBasketId.toString());
    }
    localStorage.setItem('basketItems', JSON.stringify(this.currentItems));
  }

  private clearStorage(): void {
    localStorage.removeItem('basketId');
    localStorage.removeItem('basketItems');
  }

  setCurrentBasket(basketId: number, items: BasketItem[]): void {
    this.currentBasketId = basketId;
    this.currentItems = items;
    this.saveToStorage();
  }

  getCurrentBasketId(): number | null {
    return this.currentBasketId;
  }

  getCurrentItems(): BasketItem[] {
    return this.currentItems;
  }

  clearCurrentBasket(): void {
    this.currentBasketId = null;
    this.currentItems = [];
    this.clearStorage();
  }

  // 🔁 Backend Calls
  getAll(): Observable<Basket[]> {
    return this.http.get<Basket[]>(this.apiUrl);
  }

  getById(id: number): Observable<Basket> {
    return this.http.get<Basket>(`${this.apiUrl}/${id}`);
  }

  create(basket: Basket): Observable<Basket> {
    return this.http.post<Basket>(this.apiUrl, basket);
  }

  update(id: number, basket: Basket): Observable<Basket> {
    return this.http.put<Basket>(`${this.apiUrl}/${id}`, basket);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignArticleToBasket(
    idArticle: number,
    quantity: number,
    type: 'ACHETER' | 'LOUER',
    idB?: number
  ): Observable<Basket> {
    let params = new HttpParams()
      .set('idArticle', idArticle.toString())
      .set('quantity', quantity.toString())
      .set('type', type);

    if (idB !== undefined && idB !== null) {
      params = params.set('idBasket', idB.toString());
    }

    return this.http.post<Basket>(`${this.apiUrl}/assign`, {}, { params });
  }

  unassignArticleFromBasket(
    idArticle: number,
    type: 'ACHETER' | 'LOUER',
    idBasket: number
  ): Observable<void> {
    let params = new HttpParams()
      .set('idArticle', idArticle.toString())
      .set('type', type)
      .set('idBasket', idBasket.toString());

    return this.http.delete<void>(`${this.apiUrl}/unassign`, { params });
  }
}
