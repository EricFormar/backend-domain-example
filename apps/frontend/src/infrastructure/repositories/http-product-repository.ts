import type { Product } from '@domain'
import type { ProductRepository } from '@application/use-cases/product/list-products'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export class HttpProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }
    const data = await response.json()
    return data as Product[]
  }
}