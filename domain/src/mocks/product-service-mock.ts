import { Product } from "../entities/Product"
import { ProductRepository } from "../repositories/product-repository"

export interface ProductServiceMock extends ProductRepository {
    products : Product[]
}
export function createProductServiceMock(products : Product[] = []) : ProductServiceMock {
    return {
        products,
        getAll : async function() {
            return this.products
        },
        getById: async function(id: string): Promise<Product | null> {
            return this.products.find(product => product.id === id) || null
        },
        filterByCategory : async function(categoryId: string) {
            return this.products.filter(product => product.categoryId === categoryId)
        },
        create : async function(product: Product) {
            this.products.push(product)
            return product
        },
        update : async function(product: Product) {
            const index = this.products.findIndex(p => p.id === product.id)
            if(index !== -1) {
                this.products[index] = product
            }
            return product
        },
        delete : async function(id: string) {
            const index = this.products.findIndex(product => product.id === id)
            if(index !== -1) {
                this.products.splice(index, 1)
                return true
            }
            return false
        }
    }
}