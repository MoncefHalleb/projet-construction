import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../../Services/location.service';

@Component({
  standalone: false,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private locationService: LocationService) {}

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 10); // Default location

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Click event to get location info
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.latlng;
      this.getLocationInfo(lat, lng);
    });
  }

  getLocationInfo(lat: number, lon: number) {
    this.locationService.getReverseGeocode(lat, lon).subscribe(
      (data) => {
        const locationName = data.display_name || 'Unknown Location';
        L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(`📍 ${locationName}`)
          .openPopup();
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }
}
