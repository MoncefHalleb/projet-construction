import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ReclamationService } from "../../../Services/ReclamationService/reclamation-service.service";
import {ActivatedRoute, Router} from "@angular/router";

interface Reclamation {
  id_Reclamation: number;
  title: string;
  typeReclamation: string;
  description_Reclamation: string;
  date_Reclamation: string;
  statutReclamation: string;
}

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  reclamationListForm!: FormGroup;
  reclamations: Reclamation[] = [];
  displayedReclamations: Reclamation[] = [];

  constructor(private reclamationService: ReclamationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reclamationListForm = new FormGroup({
      searchTerm: new FormControl('')
    });
    this.fetchReclamations();
  }

  fetchReclamations(): void {
    this.reclamationService.findAll().subscribe(
      (reclamations: Reclamation[]) => {
        this.reclamations = reclamations;
        this.displayedReclamations = reclamations;
      },
      error => {
        console.error('Erreur lors de la récupération des réclamations : ', error);
      }
    );
  }

  searchReclamations(): void {
    const searchTerm = this.reclamationListForm.get('searchTerm')?.value.trim().toLowerCase();
    this.displayedReclamations = this.reclamations.filter(reclamation => reclamation.title.toLowerCase().includes(searchTerm));
  }
  deleteReclamation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réclamation ?')) {
      this.reclamationService.deleteReclamation(id).subscribe(
        () => {
          console.log('Réclamation supprimée avec succès !');
          this.fetchReclamations();
        },
        (error: any) => {
          console.error('Erreur lors de la suppression de la réclamation : ', error);
        },
      );
    }
  }

  goToEditReclamation(id: number): void {
    this.router.navigate(['/admins/reclamationEdit', id]);
  }

  goToReponse(id: number): void {
    this.router.navigate(['/admins/reponse', id], { relativeTo: this.route });
  }
}
