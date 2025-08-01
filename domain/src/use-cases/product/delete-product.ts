import { createNotFoundError, NotFoundError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export interface DeleteProductDependencies {
  productRepository: ProductRepository;
}

export interface DeleteProductRequestModel {
  id: number;
}

export async function productDelete(
  { productRepository }: DeleteProductDependencies,
  { id }: DeleteProductRequestModel
): Promise<void > {
 await productRepository.delete(id);
  return;
}
