import { Category } from "../entities/Category";

export interface CategoryRepository {
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category | null>;
    create(brand: Omit<Category, 'id'>): Promise<Category>;
    update(brand: Partial<Category>): Promise<Category>;
    delete(id: number): Promise<void>;
    findByName(name: string): Promise<Category | null>;

}