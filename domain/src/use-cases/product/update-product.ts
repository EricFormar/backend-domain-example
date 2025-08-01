import { Product } from "../../entities/Product";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export interface ProductFindByIdDependencies {
  productRepository: ProductRepository;
}

export interface ProductFindByIdRequestModel {
  productToUpdate: Product;
}

export async function productUpdate(
  { productRepository }: ProductFindByIdDependencies,
  { productToUpdate }: ProductFindByIdRequestModel
): Promise<Product | NotFoundError> {
  const product = await productRepository.findById(productToUpdate.id);
  if (!product) return createNotFoundError("Product not found");
  const updatedProduct = await productRepository.update(productToUpdate);

  return updatedProduct;
}
