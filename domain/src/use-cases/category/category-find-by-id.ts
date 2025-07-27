import { Category } from "../../entities/Category";
import { createMissingDataError, createNotFoundError, NotFoundError } from "../../errors/error";
import { CategoryRepository } from "../../repositories/category-repository";

export interface CategoryFindByIdDependencies {
  categoryRepository: CategoryRepository;
}

export interface CategoryFindByIdRequestModel {
  id: string;
}

export async function findCategoryById(
  { categoryRepository }: CategoryFindByIdDependencies,
  { id }: CategoryFindByIdRequestModel
): Promise<Category | NotFoundError > {
  const category = await categoryRepository.findById(id);
  if (!category) return createNotFoundError("Category not found");
  return category;
}
