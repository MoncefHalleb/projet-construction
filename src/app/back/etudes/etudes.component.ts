  import { Component, OnInit } from '@angular/core';
  import { ApiService, Etude } from '../../Services/api.service';

  @Component({
    standalone: false,
    selector: 'app-etudes',
    templateUrl: './etudes.component.html',
    styleUrls: ['./etudes.component.css'],
  })
  export class EtudesComponent implements OnInit {
    etudes: Etude[] = [];
    selectedEtude: Etude = this.getEmptyEtude();

    selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Selected file:", file);
    }
  }


    // Weather-related properties
  city: string = '';
  weatherData: { city: string; temperature: number; description: string } | null = null;
  weatherError: string | null = null;

    constructor(private apiService: ApiService) {}

    ngOnInit(): void {
      this.fetchEtudes();
      this.resetEtude(); // Initialize selectedEtude correctly

    }
    convertDate(date: any): string {
      if (!date) return ''; // Handle null/undefined
      if (typeof date === 'string' && date.includes('-')) return date; // Already in correct format
      const formattedDate = new Date(date).toISOString().split('T')[0];
      return formattedDate;
    }
    
    getEtudes() {
      this.apiService.getEtudes().subscribe(
        (data) => {
          console.log("Etudes data loaded:", data); // Debugging output
          this.etudes = data;
        },
        (error) => {
          console.error("Error loading etudes:", error);
        }
      );
    }

    fetchEtudes(): void {
      this.apiService.getEtudes().subscribe((data) => (this.etudes = data));
    }

    saveEtude(): void {
      if (!this.selectedEtude) {
        console.error('Etude data is missing');
        return;
      }
    
      const formData = new FormData();
      formData.append('title', this.selectedEtude.title);
      formData.append('description', this.selectedEtude.description);
      formData.append('studyDate', this.selectedEtude.studyDate);
      formData.append('typeEtude', this.selectedEtude.typeEtude);
      formData.append('topographie', this.selectedEtude.topographie);
      formData.append('dateDeRealisation', this.selectedEtude.dateDeRealisation);
    
      if (this.selectedFile) {
        formData.append('document', this.selectedFile);
      }
    
      if (this.selectedEtude.id) {
        this.apiService.updateEtude(this.selectedEtude.id, formData).subscribe(
          (updatedEtude) => {
            console.log("Etude updated:", updatedEtude);
            this.etudes = this.etudes.map((etude) =>
              etude.id === updatedEtude.id ? updatedEtude : etude
            );
            this.resetEtude();
          },
          (error) => console.error("Error updating etude:", error)
        );
      } else {
        this.apiService.createEtude(formData).subscribe(
          (newEtude) => {
            console.log("Etude added:", newEtude);
            this.etudes.push(newEtude);
            this.resetEtude();
          },
          (error) => console.error("Error adding etude:", error)
        );
      }
    }
    
    
    
    
    

    editEtude(etude: Etude): void {
      this.selectedEtude = { 
        ...etude, 
        studyDate: this.convertDate(etude.studyDate),
        dateDeRealisation: this.convertDate(etude.dateDeRealisation)
      };
    }
    

    
    

    deleteEtude(id: number): void {
      this.apiService.deleteEtude(id).subscribe(() => {
        this.etudes = this.etudes.filter((e) => e.id !== id);
      });
    }

    resetEtude(): void {
      this.selectedEtude = this.getEmptyEtude();
    }
    getEmptyEtude(): Etude {
      return {
        id: undefined,  // Ensure this is undefined and not null
        title: '',
        description: '',
        studyDate: '',
        documents: '',
        typeEtude: '',
        topographie: '',
        dateDeRealisation: ''
      };
    }
    downloadFile(fileName: string): void {
      if (!fileName) {
        console.error("No file to download");
        return;
      }
    
      this.apiService.downloadEtudeFile(fileName).subscribe(
        (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        (error) => console.error("Error downloading file:", error)
      );
    }
    
    // New method to fetch weather data
  getWeather(): void {
    if (!this.city) {
      this.weatherError = "Please enter a city name";
      this.weatherData = null;
      return;
    }

    this.apiService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.weatherError = null;
        console.log("Weather data:", data);
      },
      (error) => {
        this.weatherError = "Error fetching weather data: " + (error.error?.message || error.message);
        this.weatherData = null;
        console.error("Weather error:", error);
      }
    );
  }
      
    }
