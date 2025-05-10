import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReclamationService } from '../../../Services/ReclamationService/reclamation-service.service';
import { ToastrService } from 'ngx-toastr';

interface TypeReclamation {
  type: string;
}

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  typeControl = new FormControl<TypeReclamation | null>(null, Validators.required);
  typeReclamation: TypeReclamation[] = [
    { type: 'ANNULATION' },
    { type: 'MODIFICATION' },
    { type: 'AUTRES' }
  ];

  @Input() title: string = '';
  @Input() description_Reclamation: string = '';

  reclamationForm!: FormGroup;
  selectedFile?: File;

  constructor(
    private formBuilder: FormBuilder,
    private reclamationService: ReclamationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.reclamationForm = this.formBuilder.group({
      title: ['', Validators.required],
      typeReclamation: ['', Validators.required],
      description_Reclamation: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.reclamationForm.valid) {
      const reclamation = {
        title: this.reclamationForm.value.title,
        typeReclamation: this.reclamationForm.value.typeReclamation,
        description_Reclamation: this.reclamationForm.value.description_Reclamation,
        statutReclamation: 'PENDING_REVIEW' // Must match enum in backend
      };

      const formData = new FormData();
      formData.append('reclamation', new Blob([JSON.stringify(reclamation)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }

      this.reclamationService.addReclamationWithFile(formData).subscribe({
        next: (response) => {
          this.toastr.success('Réclamation envoyée avec succès', 'Succès');

          // Optional: Show Gemini reply (if you return it in the response)
          if (response.autoReply) {
            alert('Réponse automatique :\n' + response.autoReply);
          }

          this.reclamationForm.reset();
          this.selectedFile = undefined;
        },
        error: () => {
          this.toastr.error("Une erreur est survenue lors de l'envoi", 'Erreur');
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs', 'Champs requis');
    }
  }

  onDelete(): void {
    this.reclamationForm.reset();
    this.selectedFile = undefined;
  }
}