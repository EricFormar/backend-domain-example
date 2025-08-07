import { Product } from "./Product";

export interface PurchaseItem {
    id: string;
    quantity: number;
    product: Product;
}