export interface Article {
    articleId?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    type: string;
    salesCount?: number;
    image?: string;
  }
  