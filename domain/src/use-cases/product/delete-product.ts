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
): Promise<void > {
  const product = await productRepository.findById(id);
  if (!product) throw createNotFoundError("Product not found");
  await productRepository.delete(id);
  return;
}
