import { Category } from "../../entities/Category";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { CategoryRepository } from "../../repositories/category-repository";

export interface CategoryUpdateDependencies {
  categoryRepository: CategoryRepository;
}

export interface CategoryUpdateRequestModel {
  categoryToUpdate: Category;
}

export async function updateCategory(
  { categoryRepository }: CategoryUpdateDependencies,
  { categoryToUpdate }: CategoryUpdateRequestModel
): Promise<Category | NotFoundError> {
  const category = await categoryRepository.findById(categoryToUpdate.id);
  if (!category) return createNotFoundError("Category not found");
  const updatedCategory = await categoryRepository.update(categoryToUpdate);

  return updatedCategory;
}
