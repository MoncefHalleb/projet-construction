// articles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ArticleCardComponent } from '../article-cards/article-cards.component';
import { Article } from '../../../models/Article';
import { ArticleService } from '../../Services/article.service';
import { BasketService } from '../../Services/basket.service';
import { Basket } from '../../../models/Basket';
import { Router } from '@angular/router';

type AchatType = 'ACHETER' | 'LOUER';

export type BasketItem = {
  article: Article;
  quantity: number;
  type: AchatType;
};

@Component({
  selector: 'app-articles',
  standalone: false,
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  quantities: { [id: number]: number } = {};

  basketId: number | null = null;
  showCart = false;
  private basketMap: Map<string, BasketItem> = new Map();

  constructor(
    private articleService: ArticleService,
    private basketService: BasketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (res) => {
        this.articles = res;
        this.articles.forEach(article => {
          this.quantities[article.articleId ?? 0] = 1;
        });
        this.restoreBasketState(); // ✅ Restore basket after articles are loaded
      },
      error: (err) => console.error('Error fetching articles:', err),
    });
  }

  private restoreBasketState(): void {
    const savedItems = this.basketService.getCurrentItems();
    const savedBasketId = this.basketService.getCurrentBasketId();

    if (savedItems && savedItems.length > 0) {
      this.basketId = savedBasketId;
      for (const item of savedItems) {
        const key = this.getItemKey(item.article.articleId!, item.type);
        this.basketMap.set(key, item);
      }
      this.updateItemsCount();
      this.showCart = true;
    }
  }

  onAcheter(article: Article, qty: number) {
    this.handleAction(article, qty, 'ACHETER');
  }

  onLouer(article: Article, qty: number) {
    this.handleAction(article, qty, 'LOUER');
  }

  private handleAction(article: Article, qty: number, type: AchatType): void {
    this.basketService
      .assignArticleToBasket(article.articleId!, qty, type, this.basketId ?? undefined)
      .subscribe({
        next: (basket: Basket) => {
          this.basketId = basket.basketId ?? null;

          const key = this.getItemKey(article.articleId!, type);
          if (this.basketMap.has(key)) {
            this.basketMap.get(key)!.quantity += qty;
          } else {
            this.basketMap.set(key, { article, quantity: qty, type });
          }

          this.persistBasket(); // ✅ Save to localStorage
          this.updateItemsCount();
        },
        error: (err) => {
          console.error(`❌ Failed to assign article [${type}]`, err);
        }
      });
  }

  removeItem(articleId: number, type: AchatType): void {
    const key = this.getItemKey(articleId, type);
    if (this.basketMap.has(key)) {
      this.basketMap.delete(key);

      if (this.basketId !== null) {
        this.basketService.unassignArticleFromBasket(articleId, type, this.basketId).subscribe({
          next: () => {
            console.log(`✅ Removed item from backend [${type}]`);

            if (this.basketMap.size === 0) {
              this.basketService.delete(this.basketId!).subscribe({
                next: () => {
                  console.log(`🗑️ Basket deleted as it's now empty`);
                  this.basketId = null;
                  this.showCart = false;
                  this.basketService.clearCurrentBasket(); // ✅
                },
                error: (err) => console.error(`❌ Failed to delete empty basket`, err)
              });
            } else {
              this.persistBasket(); // ✅ update storage
            }

            this.updateItemsCount();
          },
          error: (err) => console.error(`❌ Failed to unassign item`, err)
        });
      }
    }
  }

  clearCart(): void {
    if (this.basketId !== null) {
      this.basketService.delete(this.basketId).subscribe({
        next: () => {
          console.log('🧺 Basket cleared and deleted.');
          this.basketId = null;
        },
        error: (err) => console.error('❌ Failed to delete basket', err)
      });
    }

    this.basketMap.clear();
    this.showCart = false;
    this.updateItemsCount();
    this.basketService.clearCurrentBasket(); // ✅
  }

  goToOrderSummary(): void {
    if (this.basketId !== null) {
      this.basketService.setCurrentBasket(this.basketId, this.basketItems);
      this.router.navigate(['/user/orders']);
    }
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  private getItemKey(articleId: number, type: AchatType): string {
    return `${articleId}_${type}`;
  }

  get basketItems(): BasketItem[] {
    return Array.from(this.basketMap.values());
  }

  get totalItems(): number {
    return this.basketItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  private persistBasket(): void {
    this.basketService.setCurrentBasket(this.basketId!, this.basketItems);
  }

  private updateItemsCount(): void {
    // placeholder, used if you want to show a separate item count
  }

  goToAddReclamation(): void {
    this.router.navigate(['/user/reclamation']);
  }
}
