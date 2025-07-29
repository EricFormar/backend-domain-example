import { Category } from "../entities/Category";

export interface CategoryRepository {
    findAll(): Promise<Category[] | Error>;
    findById(id: string): Promise<Category | Error>;
    create(brand: Omit<Category, 'id'>): Promise<Category | Error>;
    update(brand: Partial<Category>): Promise<Category | Error>;
    delete(id: string): Promise<void | Error>;
    findByName(name: string): Promise<Category | Error>;

}