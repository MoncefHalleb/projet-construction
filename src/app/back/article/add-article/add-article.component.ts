import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ArticleService } from '../../../Services/article.service';
import { Article } from '../../../../models/Article';

@Component({
  selector: 'app-add-article',
  standalone: false,
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    type: ['', Validators.required],
    image: [null as File | null]
  });

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router
  ) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.form.patchValue({ image: file });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
  
    const article: Article = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      price: this.form.value.price!,
      stock: this.form.value.stock!,
      type: this.form.value.type!,
      salesCount: 0
    };
  
    const file = this.form.value.image as File | null;
  
    this.articleService.create(article, file!).subscribe({
      next: () => this.router.navigate(['admins/articles']),
      error: (err) => console.error('Create failed:', err),
    });
  }
  
}
