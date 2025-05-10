import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  permit_type: string;
  existing_construction: string;
  proposed_construction: string;
  neighborhood: string;
  material_type: string;
  materials_cost: number;
  labor_cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingCostService {
  private apiUrl = 'http://localhost:8000/predict'; // Change if deploying

  constructor(private http: HttpClient) {}

  predictCost(data: PredictionRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
