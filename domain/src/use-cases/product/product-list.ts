import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/product-repository";


export interface ListProductsDependencies {
  productRepository: ProductRepository;
}

export async function listProducts({
  productRepository,
}: ListProductsDependencies): Promise<Product[]> {
  return await productRepository.findAll();
}
