import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'http://localhost:8088/api/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string) {
    return this.http.get(`${this.baseUrl}/${city}`);
  }
}
