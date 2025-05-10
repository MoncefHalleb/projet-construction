import { Basket } from "./Basket";

export interface Order {
  orderId?: number;
  number: number;
  totalPrice: number;
  status: string;
  basket?: Basket;
}
