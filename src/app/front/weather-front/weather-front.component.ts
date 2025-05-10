import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';

declare var Dropbox: any;

@Component({
  selector: 'app-weather-front',
  templateUrl: './weather-front.component.html',
  styleUrl: './weather-front.component.css',
})
export class WeatherFrontComponent {
  weatherCity: string = '';
  weather: any;

  constructor(private apiService: ApiService) {}

  fetchWeather(): void {
    const city = this.weatherCity.trim();
    if (city) {
      this.apiService.getWeather(city).subscribe(
        (data) => {
          this.weather = data;
          console.log('Weather data:', data);
        },
        (error) => {
          console.error('Error fetching weather:', error);
          this.weather = null;
        }
      );
    } else {
      this.weather = null;
    }
  }

  getTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString();
  }
}
