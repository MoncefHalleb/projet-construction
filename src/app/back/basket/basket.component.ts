import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { BasketService } from '../../Services/basket.service';
import { Basket } from '../../../models/Basket';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  baskets: Basket[] = [];
  isLoading = true;

  constructor(private basketService: BasketService, private router: Router) {}

  ngOnInit(): void {
    this.loadBaskets();
  }

  loadBaskets(): void {
    this.isLoading = true;
    this.basketService.getAll().subscribe({
      next: (data) => {
        this.baskets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch baskets', err);
        this.isLoading = false;
      }
    });
  }

  confirmDelete(basket: Basket): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete basket #${basket.basketId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && basket.basketId != null) {
        this.basketService.delete(basket.basketId).subscribe({
          next: () => {
            this.baskets = this.baskets.filter(b => b.basketId !== basket.basketId);
            Swal.fire('Deleted!', 'Basket has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          }
        });
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['admins/addBasket']);
  }

  viewBasket(basket: Basket): void {
    const articleList = basket.articles?.length
      ? basket.articles.map(article => `
          <li><strong>${article.name}</strong> - ${article.price} TND</li>
        `).join('')
      : '<li>No articles assigned.</li>';

    Swal.fire({
      title: `Basket #${basket.basketId}`,
      html: `
        <div class="text-start">
          <p><strong>Total Price:</strong> ${basket.price} TND</p>
          <p><strong>Articles:</strong></p>
          <ul>${articleList}</ul>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'text-start'
      }
    });
  }
}
