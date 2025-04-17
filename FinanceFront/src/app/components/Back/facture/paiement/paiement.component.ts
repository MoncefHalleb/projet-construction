import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaiementService } from 'src/app/services/paiement.service';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css'],
})
export class PaiementComponent {
  public data: any = [];
  private subscription: Subscription = new Subscription();

  constructor(private paymentService: PaiementService) {}

  fetchAllPayment() {
    this.subscription.add(
      this.paymentService.getAll().subscribe({
        next: (res: any) => {
          this.data = res;
          console.log('Data', this.data);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des Paiement:', err);
        },
      })
    );
  }

  ngOnInit(): void {
    this.fetchAllPayment();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
