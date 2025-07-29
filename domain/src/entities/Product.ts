import { Brand } from "./Brand";
import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description: string;
  image : string;
  price: number;
  discount: number;
  category?: Category;
  brand?: Brand;
}