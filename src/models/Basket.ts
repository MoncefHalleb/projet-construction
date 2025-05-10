import { Article } from "./Article";
import { Order } from "./Order";

export interface Basket {
  basketId?: number;
  price: number;
  articles?: Article[];
  order?: Order;
}
