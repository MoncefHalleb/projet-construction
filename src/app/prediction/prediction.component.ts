import { Component } from '@angular/core';
import { PredictionService } from '../prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {
  gender: string = '';
  age: number | null = null;
  membership: string = '';
  averageRating: number | null = null;
  discountApplied: string = '';

  predictedLabel: string = '';
  probabilities: { [key: string]: number } = {};
  plotUrl: string = ''; // The URL of the prediction plot

  constructor(private predictionService: PredictionService) {}

  onSubmit(): void {
    const data = {
      gender: this.gender,
      age: this.age,
      membership: this.membership,
      average_rating: this.averageRating,
      discount_applied: this.discountApplied
    };

    this.predictionService.predict(data).subscribe((response: { 
      predicted_label: string; 
      probabilities: { [key: string]: number }; 
      plot_path?: string; 
    }) => {
      this.predictedLabel = response.predicted_label;
      this.probabilities = response.probabilities;
      this.plotUrl = response.plot_path || '';
    }, error => {
      console.error('Prediction Error:', error);
    });
  }
}
