import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ReclamationService} from "../../../Services/ReclamationService/reclamation-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-reclamation-edit',
  templateUrl: './reclamation-edit.component.html',
  styleUrl: './reclamation-edit.component.css',
})
export class ReclamationEditComponent implements OnInit {
  id_Reclamation!: number;
  reclamation: any = {};
  isLoading: boolean = false;
  reclamationForm!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
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
        console.error('Erreur lors du chargement des détails de la réclamation : ', error);
        this.isLoading = false;
      }
    );
  }

  updateReclamation(): void {
    this.isLoading = true;
    this.reclamationService.updateReclamation(this.id_Reclamation, this.reclamation).subscribe(
      response => {
        console.log('Réclamation mise à jour avec succès !', response);
        this.isLoading = false;
        this.router.navigate(['/admins/reclamationList']);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la réclamation : ', error);
        this.isLoading = false;
      }
    );
  }
}
