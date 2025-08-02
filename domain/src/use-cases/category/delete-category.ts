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
): Promise<void> {
  const category = await categoryRepository.findById(id);
  if (!category) throw createNotFoundError("Category not found");
  await categoryRepository.delete(id);
  return;
}
