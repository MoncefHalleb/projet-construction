import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ReponseService} from "../../../Services/ReponseService/reponse.service";

@Component({
  selector: 'app-reponse-edit',
  templateUrl: './reponse-edit.component.html',
  styleUrl: './reponse-edit.component.css'
})
export class ReponseEditComponent {
  id_Reponse!: number;
  reponse: any = {};
  isLoading: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private reponseService: ReponseService) {}
  ngOnInit():void {
    this.id_Reponse = this.route.snapshot.params['id'];
    this.loadReponseDetails();
  }
  loadReponseDetails():void {
    this.isLoading = true;
    this.reponseService.findById(this.id_Reponse).subscribe(
      (data: any) => {
        this.reponse = data;
        this.isLoading = false;
      },
      error => {
        console.error('Erreur',error);
        this.isLoading = false;
      }
    );
  }
  updateReponse(): void {
    this.isLoading = true;
    this.reponseService.updateReponse(this.id_Reponse, this.reponse).subscribe(
      response => {
        console.log('Succès',response);
        this.isLoading = false;
        this.router.navigate(['/admins/reponseList']);
      },
      error => {
        console.log('Erreur',error);
        this.isLoading = false;
      }
    );
  }
}
