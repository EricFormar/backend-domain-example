import { createNotFoundError, NotFoundError } from "../../errors/error";
import { CategoryRepository } from "../../repositories/category-repository";

export interface DeleteCategoryDependencies {
  categoryRepository: CategoryRepository;
}

export interface DeleteCategoryRequestModel {
  id: number;
}

export async function deleteCategory(
  { categoryRepository }: DeleteCategoryDependencies,
  { id }: DeleteCategoryRequestModel
): Promise<void> {
  await categoryRepository.delete(id);
  return;
}
