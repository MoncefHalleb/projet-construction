import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from '../../Services/order.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { Order } from '../../../models/Order';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.isLoading = false;
      }
    });
  }

  confirmDelete(order: Order): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete order #${order.number}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && order.orderId != null) {
        this.orderService.delete(order.orderId).subscribe({
          next: () => {
            this.orders = this.orders.filter(o => o.orderId !== order.orderId);
            Swal.fire('Deleted!', 'The order has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire('Oops!', 'Something went wrong while deleting.', 'error');
          }
        });
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['admins/addOrder']);
  }
  viewOrder(order: Order): void {
    Swal.fire({
      title: `Order #${order.number}`,
      html: `
        <div style="text-align:left;">
          <p><strong>ID:</strong> ${order.orderId}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice} TND</p>
          <p><strong>Status:</strong> ${order.status}</p>
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
