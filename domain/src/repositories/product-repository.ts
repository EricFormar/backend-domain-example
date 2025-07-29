import { Product } from "../entities/Product";

export interface ProductRepository {
    findAll(): Promise<Product[] | Error>;
    findById(id: string): Promise<Product | Error>;
    create(product: Omit<Product, 'id'>): Promise<Product | Error>;
    update(product: Partial<Product>): Promise<Product | Error> ;
    delete(id: string): Promise<void | Error>;
    search(data: Partial<Product>): Promise<Product[] | Error>;
    count(): Promise<number | Error>;
}