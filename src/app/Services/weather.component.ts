import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  standalone : false ,
 selector: 'app-weather',
  templateUrl: './weather.component.html'
})
export class WeatherComponent {

  weatherData: any;
  city: string = 'Tunis'; // Default city

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.weatherService.getWeather(this.city).subscribe(data => {
      this.weatherData = data;
      console.log(this.weatherData);
    });
  }
}
