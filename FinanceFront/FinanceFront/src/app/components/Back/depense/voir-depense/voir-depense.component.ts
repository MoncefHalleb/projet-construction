import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';
import { TypeDepense } from 'src/app/models/typeDepense';
import { DepenseService } from 'src/app/services/depense.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voir-depense',
  templateUrl: './voir-depense.component.html',
  styleUrls: ['./voir-depense.component.css'],
})
export class VoirDepenseComponent {
  public data: any = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 2;
  public typeDepensesMap: Record<string, string> = {};
  public typeDepenses: string[] = [];

  public idDespense: any;
  testIdSelectionne: number = 0;
  nouvelleDepense: any = {
    description: '',
    montant: 0,
    type: '',
    date: '',
    justificatif: null,
  };
  constructor(
    private depenseService: DepenseService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}
  private searchSubject: Subject<string> = new Subject();
  private subscription: Subscription = new Subscription();
  ngOnInit(): void {
    this.fetchAllDepense();

    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(300), // Attend 300 ms après la dernière frappe
          distinctUntilChanged() // Évite les appels multiples avec la même valeur
        )
        .subscribe((searchText) => {
          this.searchTests(searchText);
        })
    );

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

  openModal(content: any, idepense: any): void {
    this.idDespense = idepense;
    this.fetchDepenseById(idepense);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Méthode appelée lors de la saisie dans l'input
  onSearch(searchText: string): void {
    this.searchSubject.next(searchText);
  }

  // Recherche des tests via le backend
  searchTests(searchText: string): void {
    if (!searchText) {
      this.fetchAllDepense();
      return;
    }
    this.subscription.add(
      this.depenseService.searchDepenses(searchText).subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Résultats de la recherch e', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la recherche des tests:', err);
        },
      })
    );
  }

  fetchAllDepense() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.subscription.add(
      this.depenseService.getAllByProject(idParam).subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }

  addTest(): void {
    this.router.navigate(['/test/add']);
  }

  ouvrirFormulaireEditDepense(testId: number): void {
    this.router.navigate(['/test/edit', testId]);
  }

  supprimerDepense(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.depenseService.delete(id).subscribe(
          () => {
            // Supprimer l'élément du tableau
            this.data = this.data.filter((desp: any) => desp.id !== id);

            // Vérifier si la page actuelle est vide après suppression
            const totalItems = this.data.length;
            const totalPages = Math.ceil(totalItems / this.itemsPerPage);

            if (this.currentPage > totalPages) {
              this.currentPage = totalPages || 1; // Revenir à la dernière page existante
            }

            Swal.fire('Supprimé !', 'Le Depense a été supprimé.', 'success');
          },
          (error) => {
            console.error('Erreur lors de la suppression', error);
            Swal.fire('Erreur', 'Impossible de Depense ce test.', 'error');
          }
        );
      }
    });
  }

  downloadFile(id: any) {
    this.depenseService.getFile(id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fichier'; // Changez le nom du fichier si nécessaire
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement du fichier', error);
      }
    );
  }

  fetchDepenseById(id: number): void {
    this.depenseService.getById(id).subscribe({
      next: (data) => {
        this.nouvelleDepense = {
          description: data.description,
          montant: data.montant,
          type: data.type,
          date: new Date(data.date).toISOString().split('T')[0], // Convertir la date en format YYYY-MM-DD
        };
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la dépense :', err);
      },
    });
  }

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
    };

    console.log('Dépense à envoyer:', newDepense);
    this.depenseService.update(this.idDespense, newDepense).subscribe({
      next: (createdDepense) => {
        console.log('Dépense ajoutée:', createdDepense);
        Swal.fire({
          title: 'Success!',
          text: 'The Project has been Modifier successfully.',
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
}
