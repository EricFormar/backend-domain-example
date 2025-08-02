import { BrandResponseDto } from "./brand-response.dto";
import { CategoryResponseDto } from "./category-response.dto";

export interface ProductResponseDto {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  brand: BrandResponseDto;
  category: CategoryResponseDto;
}