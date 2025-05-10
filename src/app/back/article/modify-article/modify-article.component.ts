import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../Services/article.service';
import { Article } from '../../../../models/Article';

@Component({
  selector: 'app-modify-article',
  standalone: false,
  templateUrl: './modify-article.component.html',
  styleUrls: ['./modify-article.component.css']
})
export class ModifyArticleComponent implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    type: ['', Validators.required],
    image: [null as File | null]
  });

  articleId!: number;
  isLoading = true;
  currentImage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.articleService.getById(this.articleId).subscribe({
      next: (article: Article) => {
        this.form.patchValue({
          name: article.name,
          description: article.description,
          price: article.price,
          stock: article.stock,
          type: article.type
        });
    
        this.currentImage = article.image ?? null; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading article:', err);
        this.isLoading = false;
      }
    });
    
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.currentImage = null; 
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
  
    const article: Article = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      price: this.form.value.price!,
      stock: this.form.value.stock!,
      type: this.form.value.type!
    };
  
    const file = this.form.value.image as File | null;
  
    this.articleService.update(this.articleId, article, file!).subscribe({
      next: () => this.router.navigate(['admins/articles']),
      error: (err) => console.error('Update failed:', err),
    });
  }
  
}
