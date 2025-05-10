import { Component } from '@angular/core';
import { BuildingCostService, PredictionRequest } from '../building-cost.service';

@Component({
  selector: 'app-building-cost',
  templateUrl: './building-cost.component.html',
  styleUrls: ['./building-cost.component.css'],
  standalone: false
})
export class BuildingCostComponent {
  // Dropdown options – must match label encoder classes
  permitTypes = ['0', '1', '2' ,'3','4', '5', '6' ,'7'];  // update as needed
  existingConstructionTypes = ['0', '1', '2','3', '4']; // update as needed
  proposedConstructionTypes = ['0', '1', '2','3', '4']; // update as needed
  neighborhoods = ['0', '1', '2' ,'3','4', '5', '6' ,'7'];       // update as needed
  materialTypes = ['Asphalt', 'Brick', 'Ceramic Tiles','Concrete', 'Fire Resistant Material','Glass','Granite/Marble Countertop','other'];                 // update as needed

  data: PredictionRequest = {
    permit_type: '',
    existing_construction: '',
    proposed_construction: '',
    neighborhood: '',
    material_type: '',
    materials_cost: 0,
    labor_cost: 0
  };

  predictedCost: number | null = null;
  errorMessage: string | null = null;

  constructor(private costService: BuildingCostService) {}

  submit() {
    this.costService.predictCost(this.data).subscribe({
      next: (res) => {
        this.predictedCost = res.predicted_cost;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.error.detail || 'Prediction failed';
        this.predictedCost = null;
      }
    });
  }
}
