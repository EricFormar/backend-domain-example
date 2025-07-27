import { createNotFoundError, NotFoundError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export interface DeleteProductDependencies {
  productRepository: ProductRepository;
}

export interface DeleteProductRequestModel {
  id: string;
}

export async function deleteProduct(
  { productRepository }: DeleteProductDependencies,
  { id }: DeleteProductRequestModel
): Promise<Boolean | NotFoundError > {
  const result = await productRepository.delete(id);
  if (!result) return createNotFoundError("Product not found");
  return result;
}
