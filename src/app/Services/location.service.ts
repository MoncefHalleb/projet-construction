import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:8088/api/location/reverse-geocode'; // Adjust for your backend URL

  constructor(private http: HttpClient) {}

  getReverseGeocode(lat: number, lon: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${lat}&lon=${lon}`);
  }
}
