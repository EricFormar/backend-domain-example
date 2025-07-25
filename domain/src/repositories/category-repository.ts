import { Category } from "../entities/Category";

export interface CategoryRepository {
    getAll() : Promise<Category[]>,
    getById(id: string) : Promise<Category | null>,
    create(category: Category) : Promise<Category>,
    update(category: Category) : Promise<Category | null>,
}