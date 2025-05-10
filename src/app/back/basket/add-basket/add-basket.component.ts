import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasketService } from '../../../Services/basket.service';
import { ArticleService } from '../../../Services/article.service';
import { Article } from '../../../../models/Article';
import { Basket } from '../../../../models/Basket';

@Component({
  selector: 'app-add-basket',
  standalone: false,
  templateUrl: './add-basket.component.html',
  styleUrls: ['./add-basket.component.css']
})
export class AddBasketComponent implements OnInit {
  form = this.fb.group({
    price: [0, [Validators.required, Validators.min(0)]],
    selectedArticles: [[]] // articleId[]
  });

  allArticles: Article[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private basketService: BasketService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.allArticles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load articles', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const basket: Basket = {
      price: this.form.value.price!,
    };

    // First create basket
    this.basketService.create(basket).subscribe({
      next: (created) => {
        const basketId = created.basketId!;
        const selected = this.form.value.selectedArticles ?? [];

        if (selected.length > 0) {
          // Assign each article
          selected.forEach(articleId => {
            this.basketService.assignArticleToBasket(articleId, 1, 'ACHETER', basketId).subscribe();
          });
        }

        this.router.navigate(['admins/baskets']);
      },
      error: (err) => {
        console.error('Create failed:', err);
      }
    });
  }
}
