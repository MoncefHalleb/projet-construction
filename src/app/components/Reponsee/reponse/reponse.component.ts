import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReponseService} from "../../../Services/ReponseService/reponse.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reponse',
  templateUrl: './reponse.component.html',
  styleUrl: './reponse.component.css'
})
export class ReponseComponent implements OnInit {
  @Input() message_reponse: string = '';
  reponseForm! : FormGroup;
  idReclamation: number = 0;

  constructor(private formBuilder: FormBuilder, private reponseService: ReponseService, private route: ActivatedRoute) {}
  ngOnInit():void {
    this.idReclamation = this.route.snapshot.params['id']; // Récupérer l'ID de la réclamation depuis l'URL
    this.reponseForm = this.formBuilder.group({
      message_reponse: ['', Validators.required],
      idReclamation: [this.idReclamation, Validators.required] // Pré-remplir l'ID de la réclamation dans le formulaire
    });
  }
  onSubmit(){
    this.reponseService.addReponse(this.reponseForm.value, this.idReclamation)
      .subscribe(
        response => {
          console.log('Réponse avec succées !', response);
          this.reponseForm.reset();
        },
        error => {
          console.error('Erreur lors de la réponse !', error);
        }
      );
  }
  onDelete(): void {
    this.reponseForm.reset();
  }
}
