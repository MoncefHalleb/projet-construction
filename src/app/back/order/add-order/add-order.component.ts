import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../Services/order.service';
import { Order } from '../../../../models/Order';

@Component({
  selector: 'app-add-order',
  standalone: false,
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent {
  form = this.fb.group({
    number: [null, [Validators.required, Validators.min(1)]],
    totalPrice: [0, [Validators.required, Validators.min(0)]],
    status: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const newOrder: Order = {
      number: this.form.value.number!,
      totalPrice: this.form.value.totalPrice!,
      status: this.form.value.status!
    };

    this.orderService.create(newOrder).subscribe({
      next: () => this.router.navigate(['admins/orders']),
      error: (err) => console.error('Order creation failed:', err)
    });
  }
}
