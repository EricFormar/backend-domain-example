import type { Product } from '@domain'

export interface ProductRepository {
  list(): Promise<Product[]>
}

export async function listProducts(productRepository: ProductRepository): Promise<Product[]> {
  return productRepository.list()
}