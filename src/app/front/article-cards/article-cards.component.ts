// src/app/components/article-card/article-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../../models/Article';
import Swal from 'sweetalert2';
import { ArticleService } from '../../Services/article.service';

@Component({
  selector: 'app-article-card',
  standalone: false,
  templateUrl: './article-cards.component.html',
  styleUrls: ['./article-cards.component.css'],
})
export class ArticleCardComponent {
  @Input() article!: Article;
  @Input() quantity: number = 1;

  @Output() acheterClicked = new EventEmitter<number>();
  @Output() louerClicked = new EventEmitter<number>();

  constructor(private articleService:ArticleService) {}

  acheter() {
    this.acheterClicked.emit(this.quantity);
  }

  louer() {
    this.louerClicked.emit(this.quantity);
  }
  increment() {
    if (this.quantity < this.article.stock) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  generateArticleDescription(id: number) {
    this.articleService.generateArticleDescription(id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Generated description',
          text: response.message,
          icon: 'info',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Generated description',
          text: err.error,
          icon: 'warning',
        });
      },
    });
  }
}
