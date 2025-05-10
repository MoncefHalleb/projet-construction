import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReclamationService} from "../../../Services/ReclamationService/reclamation-service.service";
import { Location } from '@angular/common';

@Component({
  selector: 'app-reclamation-edit-user',
  templateUrl: './reclamation-edit-user.component.html',
  styleUrl: './reclamation-edit-user.component.css'
})
export class ReclamationEditUserComponent implements OnInit {
  id_Reclamation!: number;
  reclamation: any = {};
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private reclamationService: ReclamationService
  ) {}


  ngOnInit():void {
    this.id_Reclamation = this.route.snapshot.params['id'];
    this.loadReclamationDetails();
  }
  loadReclamationDetails(): void {
    this.isLoading = true;
    this.reclamationService.findById(this.id_Reclamation).subscribe(
      (data: any) => {
        this.reclamation = data;
        this.isLoading = false;
      },
      error => {
        console.error('Erreur',error);
        this.isLoading = false;
      }
    );
  }

  updateReclamation(): void {
    this.isLoading = true;
    this.reclamationService.updateReclamation(this.id_Reclamation, this.reclamation).subscribe(
      response => {
        console.log('ça va ! ', response);
        this.isLoading = false;
        this.location.back();
      },
      error => {
        console.log('Erreur',error);
        this.isLoading = false;
      }
    );
  }
}
