import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from '../../../Services/ReclamationService/reclamation-service.service';

@Component({
  selector: 'app-reclamation-statistique',
  templateUrl: './reclamation-statistique.component.html',
  styleUrls: ['./reclamation-statistique.component.css']
})
export class ReclamationStatistiqueComponent implements OnInit {
  // Données pour le graphique
  data: any[] = [];

  // Configuration du graphique
  view: [number, number] = [700, 400];
  explodeSlices = false;
  doughnut = true;

  constructor(private reclamationService: ReclamationService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Appel du service pour récupérer les statistiques
    this.reclamationService.getReclamationStatistics().subscribe(
      (statistics: any) => {
        // Convertir les données en format attendu par ngx-charts
        this.data = Object.keys(statistics).map((key) => {
          return {
            name: key,
            value: statistics[key]
          };
        });
        this.cdr.detectChanges();
      },
      error => {
        console.error('Une erreur est survenue lors de la récupération des statistiques : ', error);
      }
    );
  }

  goToReclamationList(): void {
    this.router.navigate(['/admins/reclamationList']);
  }
}
