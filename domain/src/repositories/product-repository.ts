import { Product } from "../entities/Product";

export interface ProductRepository {
    getAll() : Promise<Product[]>,
    getById(id: string) : Promise<Product | null> ,
    filterByCategory(categoryId: string) : Promise<Product[]>,
    create(product: Product) : Promise<Product>,
    update(product: Product) : Promise<Product>,
    delete(id: string) : Promise<boolean>
}