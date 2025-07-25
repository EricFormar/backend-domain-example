import { Category } from "../../entities/Category";
import { CategoryRepository } from "../../repositories/category-repository";

export interface ListCategoryDependencies {
    categoryRepository : CategoryRepository
};

export interface ListCategoryResponseModel {
    categories : Category[]
}

export async function listCategory({categoryRepository} : ListCategoryDependencies) : Promise<ListCategoryResponseModel> {
    
    const categories = await categoryRepository.getAll();

    return {
        categories
    }
}