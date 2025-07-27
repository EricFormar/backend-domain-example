import { Category } from "../entities/Category";

export interface CategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category | null>;
    create(brand: Omit<Category, 'id'>): Promise<Category>;
    update(brand: Partial<Category>): Promise<Category>;
    delete(id: string): Promise<boolean>;
    findByName(name: string): Promise<Category | null>;

}