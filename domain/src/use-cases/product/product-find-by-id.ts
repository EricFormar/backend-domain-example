import { Product } from "../../entities/Product";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export interface ProductFindByIdDependencies {
  productRepository: ProductRepository;
}

export interface ProductFindByIdRequestModel {
  id: string;
}

export async function findProductById(
  { productRepository }: ProductFindByIdDependencies,
  { id }: ProductFindByIdRequestModel
): Promise<Product | NotFoundError > {
  const product = await productRepository.findById(id);
  if (!product) throw createNotFoundError("Product not found");
  return product;
}
