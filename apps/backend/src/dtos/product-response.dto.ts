import { BrandResponseDto } from "./brand-response.dto";
import { CategoryResponseDto } from "./category-response.dto";

export interface ProductResponseDto {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  stock : number;
  brand?: BrandResponseDto;
  category?: CategoryResponseDto;
}