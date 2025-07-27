import { Category } from "../../entities/Category";
import { CategoryRepository } from "../../repositories/category-repository";

export interface ListCategoryDependencies {
  categoryRepository: CategoryRepository;
}

export async function listCategory({
  categoryRepository,
}: ListCategoryDependencies): Promise<Category[]> {
  return await categoryRepository.findAll();
}
