import { Product } from "../entities/Product";

export interface ProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(product: Omit<Product, 'id'>): Promise<Product>;
    update(product: Partial<Product>): Promise<Product> ;
    delete(id: number): Promise<void>;
    search(data: Partial<Product>): Promise<Product[]>;
    count(): Promise<number>;
}