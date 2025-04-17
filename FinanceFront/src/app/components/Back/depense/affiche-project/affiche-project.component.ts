import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { TypeDepense } from 'src/app/models/typeDepense';
import { DepenseService } from 'src/app/services/depense.service';
import { FactureService } from 'src/app/services/facture.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-affiche-project',
  templateUrl: './affiche-project.component.html',
  styleUrls: ['./affiche-project.component.css'],
})
export class AfficheProjectComponent {
  public data: any = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 2;

  // Map for display values to enum keys
  public typeDepensesMap: Record<string, string> = {};
  public typeDepenses: string[] = [];

  nouvelleDepense: any = {
    description: '',
    montant: 0,
    type: '',
    date: '',
    justificatif: null,
  };
  selectedFile: File | null = null;
  selectedFileupload!: File;
  message = '';
  selectedProjetId!: number;
  private activeModal: any;
  private searchSubject: Subject<string> = new Subject();
  private subscription: Subscription = new Subscription();

  constructor(
    private depenseService: DepenseService,
    private router: Router,
    private modalService: NgbModal,
    private factureService: FactureService
  ) {
    // Create a mapping between display values and enum keys
    this.typeDepensesMap = {};
    for (const key in TypeDepense) {
      if (isNaN(Number(key))) {
        // Filter out numeric keys
        this.typeDepensesMap[TypeDepense[key as keyof typeof TypeDepense]] =
          key;
      }
    }
    this.typeDepenses = Object.values(TypeDepense);
  }

  ngOnInit(): void {
    this.fetchAllProject();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    console.log('Nom fichier :', file.name);
    console.log('Taille :', file.size, 'bytes');
    console.log('Type MIME :', file.type);

    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
      this.selectedFileupload = file;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Format non supporté',
        text: 'Veuillez sélectionner un fichier .xlsx ou .csv',
      });
    }
  }

  openUploadModal(content: any, projetId: number) {
    this.selectedProjetId = projetId;
    this.activeModal = this.modalService.open(content);
  }

  fetchAllProject() {
    this.subscription.add(
      this.depenseService.getAllProject().subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des Project:', err);
        },
      })
    );
  }

  // Dans affiche-project.component.ts
  uploadFile() {
    this.depenseService
      .uploadFileDepense(this.selectedFileupload, this.selectedProjetId)
      .subscribe({
        next: (responseText: string) => {
          // 👈 Réponse traitée comme texte
          Swal.fire('Succès !', responseText, 'success');
          this.activeModal.close();
        },
        error: (err) => {
          Swal.fire('Erreur', err.error || "Échec de l'import", 'error');
        },
      });
  }
  // **Ouvrir le Modal**
  openModal(content: any, idProjet: any): void {
    this.nouvelleDepense.idProjet = idProjet;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // **Gérer le fichier sélectionné**
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // **Envoyer la Dépense**
  onSubmit(modal: any): void {
    // Look up the enum key using the display value
    const typeKey = this.typeDepensesMap[this.nouvelleDepense.type];
    console.log('Type stocké:', this.nouvelleDepense.type);
    console.log('Clé trouvée:', typeKey);

    const newDepense = {
      idProjet: this.nouvelleDepense.idProjet,
      montant: this.nouvelleDepense.montant,
      type: typeKey, // Use the display value directly
      description: this.nouvelleDepense.description,
      fileData: null,
    };

    console.log('Dépense à envoyer:', newDepense);
    this.depenseService.add(newDepense).subscribe({
      next: (createdDepense) => {
        console.log('Dépense ajoutée:', createdDepense);

        if (this.selectedFile) {
          this.depenseService
            .uploadFile(this.selectedFile, createdDepense.id)
            .subscribe({
              next: (response) => console.log(response),
              error: (error) => console.error(error),
            });
        }
        Swal.fire({
          title: 'Success!',
          text: 'The Project has been added successfully.',
          icon: 'success', // Icône pour succès : success, error, warning, info, question
          confirmButtonText: 'OK',
        });

        modal.close();
      },
      error: (err) => {
        console.error('Erreur:', err);
      },
    });
  }

  viewDepense(id: number): void {
    this.router.navigate(['/afficheDepense/', id]);
  }

  upload(id: any) {
    const formData = new FormData();
    formData.append('file', this.selectedFileupload);
    this.depenseService
      .uploadFileDepense(this.selectedFileupload, id)
      .subscribe({
        next: () => (this.message = 'Fichier importé avec succès !'),
        error: (err) =>
          (this.message = "Erreur lors de l'import : " + err.error),
      });
  }

  generateFacture(id: number): void {
    this.factureService.add(id).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
    Swal.fire({
      title: 'Success!',
      text: 'Facture Generate Success successfully.',
      icon: 'success', // Icône pour succès : success, error, warning, info, question
      confirmButtonText: 'OK',
    });
  }
}
