import { Category } from "../../entities/Category";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";
import { CategoryRepository } from "../../repositories/category-repository";

export type CategoryCreateRequestModel = Omit<Category, "id">;
export interface CategoryCreateDependencies {
  categoryRepository: CategoryRepository;
}

export async function categoryCreate(
  { categoryRepository }: CategoryCreateDependencies,
  { name, image }: CategoryCreateRequestModel
): Promise<InvalidDataError | Category> {
  const hasErrors = validateData(name)
  if(hasErrors) throw hasErrors;
  
  const existingBrand = await categoryRepository.findByName(name);
  if (existingBrand) throw createInvalidDataError("Name already in use");

  const category : Omit<Category, "id"> = {
    name,
    image,
  };

  return await categoryRepository.create(category);
}


function validateData(
  name: string
): InvalidDataError | void {
  if (name.trim() === "") {
    return createInvalidDataError("Name must be not empty");
  }
  if (name.trim().length > 20) {
    return createInvalidDataError("Name cannot be longer than 20 characters");
  }
}
