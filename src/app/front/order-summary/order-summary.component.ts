// order-summary.component.ts
import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../Services/basket.service';
import { OrderService } from '../../Services/order.service';
import { Router } from '@angular/router';
import { BasketItem } from '../articles/articles.component';
import { Order } from '../../../models/Order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  standalone: false,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit {
  basketItems: BasketItem[] = [];
  total: number = 0;

  constructor(
    private basketService: BasketService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.basketItems = this.basketService.getCurrentItems();
    this.total = this.basketItems.reduce((acc, item) => acc + item.article.price * item.quantity, 0);
  }

  confirmOrder(): void {
    const basketId = this.basketService.getCurrentBasketId();
    if (basketId) {
      this.orderService.submitOrder(basketId).subscribe({
        next: (order: Order) => {
          console.log('✅ Order submitted:', order);
          this.basketService.clearCurrentBasket();
          this.router.navigate(['/thank-you']); // Optional: Redirect
        },
        error: (err) => {
          console.error('❌ Order submission failed', err);
        }
      });
    }
  }
}
