import { Component } from '@angular/core';
import { ApiService, Etude } from '../../Services/api.service';

@Component({
  selector: 'app-etudes-front',
  templateUrl: './etudes-front.component.html',
  styleUrl: './etudes-front.component.css',
})
export class EtudesFrontComponent {
  etudes: Etude[] = [];

  city: string = '';
  weatherData: {
    city: string;
    temperature: number;
    description: string;
  } | null = null;
  weatherError: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchEtudes();
  }

  getEtudes() {
    this.apiService.getEtudes().subscribe(
      (data) => {
        console.log('Etudes data loaded:', data); // Debugging output
        this.etudes = data;
      },
      (error) => {
        console.error('Error loading etudes:', error);
      }
    );
  }

  fetchEtudes(): void {
    this.apiService.getEtudes().subscribe((data) => (this.etudes = data));
  }

  downloadFile(fileName: string): void {
    if (!fileName) {
      console.error('No file to download');
      return;
    }

    this.apiService.downloadEtudeFile(fileName).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      (error) => console.error('Error downloading file:', error)
    );
  }

  // New method to fetch weather data
  getWeather(): void {
    if (!this.city) {
      this.weatherError = 'Please enter a city name';
      this.weatherData = null;
      return;
    }

    this.apiService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.weatherError = null;
        console.log('Weather data:', data);
      },
      (error) => {
        this.weatherError =
          'Error fetching weather data: ' +
          (error.error?.message || error.message);
        this.weatherData = null;
        console.error('Weather error:', error);
      }
    );
  }
}
