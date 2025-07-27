import { createNotFoundError, NotFoundError } from "../../errors/error";
import { CategoryRepository } from "../../repositories/category-repository";

export interface DeleteCategoryDependencies {
  categoryRepository: CategoryRepository;
}

export interface DeleteCategoryRequestModel {
  id: string;
}

export async function deleteCategory(
  { categoryRepository }: DeleteCategoryDependencies,
  { id }: DeleteCategoryRequestModel
): Promise<Boolean | NotFoundError > {
  const result = await categoryRepository.delete(id);
  if (!result) return createNotFoundError("Category not found");
  return result;
}
