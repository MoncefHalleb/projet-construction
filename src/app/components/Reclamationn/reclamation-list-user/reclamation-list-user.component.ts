import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ReclamationService} from "../../../Services/ReclamationService/reclamation-service.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reclamation-list-user',
  templateUrl: './reclamation-list-user.component.html',
  styleUrl: './reclamation-list-user.component.css'
})
export class ReclamationListUserComponent implements OnInit {
  reclamations: any[] = [];
  reclamationListForm!:FormGroup;

  constructor(private reclamationService: ReclamationService, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.reclamationListForm = new FormGroup({});
    this.fetchReclamations();
  }

  fetchReclamations():void {
    this.reclamationService.findAll().subscribe(
      reclamations => {
        this.reclamations = reclamations;
      },
      error => {
        console.error('Erreur',error);
      }
    );
  }
  deleteReclamation(id: number):void {
    if (confirm('Voulez-vous supprimer ?')) {
      this.reclamationService.deleteReclamation(id).subscribe(
        () => {
          console.log('Supprimé avec succès !');
          this.fetchReclamations();
        },
        (error:any) => {
          console.error('Erreur ! ',error);
        },
      );
    }
  }
  goToEditReclamation(id: number): void {
    this.router.navigate(['/user/reclamationEditUser', id]);
  }
}
