import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/product-repository";

export interface SearchProductDependencies {
  productRepository: ProductRepository;
}

export interface SearchProductRequestModel {
  dataToSearch: Partial<Product>;
}

export async function searchProducts(
  { productRepository }: SearchProductDependencies,
  { dataToSearch }: SearchProductRequestModel
): Promise<Product[]> {
  return await productRepository.search(dataToSearch);
}
