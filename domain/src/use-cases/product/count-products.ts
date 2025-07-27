import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/product-repository";


export interface CountProductsDependencies {
  productRepository: ProductRepository;
}

export async function countProducts({
  productRepository,
}: CountProductsDependencies): Promise<number> {
  return await productRepository.count();
}
