import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ReponseService} from "../../../Services/ReponseService/reponse.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reponse-list',
  templateUrl: './reponse-list.component.html',
  styleUrl: './reponse-list.component.css'
})
export class ReponseListComponent implements OnInit {
  reponses: any[] = [];
  // reclamation_id_reclamation
  reponseListForm!: FormGroup;

  constructor(private reponseService: ReponseService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit():void {
    this.reponseListForm=new FormGroup({})
    this.fetchReponses();
  }
  fetchReponses():void {
    this.reponseService.findAll()
      .subscribe(
        reponses => {
          this.reponses = reponses;
        },
        error => {
          console.error('errrreuuuur')
        }
      );
  }

  deleteReponse(id:number):void {
    if (confirm('Voulez-vous vraiment supprimer cette réponse ?')) {
      this.reponseService.deleteReponse(id).subscribe(
        () => {
          console.log('Réponse supprimé avec succées !');
          this.fetchReponses();
        },
        (error: any) => {
          console.log('ERREEEUURURURU')
        },
      );
    }
  }
  goToEditReponse(id: number):void {
    this.router.navigate(['/admins/reponseEdit', id]);
  }
}
