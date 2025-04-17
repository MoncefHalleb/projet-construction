import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FactureService } from 'src/app/services/facture.service';
import { PaiementService } from 'src/app/services/paiement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css'],
})
export class FactureListComponent {
  private subscription: Subscription = new Subscription();
  constructor(
    private factureService: FactureService,
    private paymentService: PaiementService
  ) {}
  public data: any = [];

  fetchAllFacture() {
    this.subscription.add(
      this.factureService.getAll().subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des Facture:', err);
        },
      })
    );
  }

  ngOnInit(): void {
    this.fetchAllFacture();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  downloadFacture(factureId: any): void {
    this.factureService.downloadFacturePdf(factureId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${factureId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  callCreatePaymentIntent(data: any): void {
    this.paymentService.createPaymentIntent(data).subscribe({
      next: (response) => {
        console.log('Client Secret:', response.clientSecret);
        Swal.fire({
          title: 'Success!',
          text: ' successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création du PaymentIntent :', error);
      },
    });
  }
}
