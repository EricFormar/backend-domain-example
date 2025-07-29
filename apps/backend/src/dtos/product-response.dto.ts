import { Brand } from "@domain/src/entities/Brand";
import { Category } from "@domain/src/entities/Category";
import { BrandResponseDto } from "./brand-response.dto";
import { CategoryResponseDto } from "./category-response.dto";

export interface ProductResponseDto {
  id: number;
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  brand: BrandResponseDto;
  category: CategoryResponseDto;
}