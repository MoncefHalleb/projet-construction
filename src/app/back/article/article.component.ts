import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../../models/Article';
import { ArticleService } from '../../Services/article.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  articles: Article[] = [];
  isLoading = true;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.isLoading = true;
    this.articleService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.articles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch articles', err);
        this.isLoading = false;
      },
    });
  }

  confirmDelete(article: Article): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete article "${article.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed && article.articleId != null) {
        this.articleService.delete(article.articleId).subscribe({
          next: () => {
            this.articles = this.articles.filter(
              (a) => a.articleId !== article.articleId
            );
            Swal.fire('Deleted!', 'The article has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire('Oops!', 'Something went wrong while deleting.', 'error');
          },
        });
      }
    });
  }

  navigateToEdit(id?: number): void {
    if (id != null) {
      this.router.navigate(['admins/modifyArticle', id]);
    } else {
      console.warn('No article ID provided');
    }
  }
  navigateToCreate(): void {
    this.router.navigate(['admins/addArticle']);
  }

  viewArticle(article: Article): void {
    Swal.fire({
      title: `${article.name}`,
      html: `
        <div class="text-start">
          <p><strong>ID:</strong> ${article.articleId}</p>
          <p><strong>Description:</strong> ${article.description}</p>
          <p><strong>Price:</strong> ${article.price} TND</p>
          <p><strong>Stock:</strong> ${article.stock}</p>
          <p><strong>Type:</strong> ${article.type}</p>
          <p><strong>Sales Count:</strong> ${article.salesCount ?? 0}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'text-start',
      },
    });
  }

  exportToExcel(): void {
    this.articleService.exportToExcel().subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'articles.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: (err) => {
        console.error('Export failed', err);
        Swal.fire('Error', 'Failed to export Excel', 'error');
      },
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.articleService.importFromExcel(file).subscribe({
        next: (importedArticles) => {
          Swal.fire('Success', 'Articles imported successfully!', 'success');
          this.loadArticles(); // refresh list
        },
        error: (err) => {
          console.error('Import failed', err);
          Swal.fire('Error', 'Failed to import Excel file', 'error');
        },
      });
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
