import { Product } from "../../entities/Product";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export interface ProductUpdateDependencies {
  productRepository: ProductRepository;
}

export interface ProductUpdateRequestModel {
  productToUpdate: Product;
}

export async function updateProduct(
  { productRepository }: ProductUpdateDependencies,
  { productToUpdate }: ProductUpdateRequestModel
): Promise<Product | NotFoundError> {
  const product = await productRepository.findById(productToUpdate.id);
  if (!product) throw createNotFoundError("Product not found");
  const updatedProduct = await productRepository.update(productToUpdate);

  return updatedProduct;
}
