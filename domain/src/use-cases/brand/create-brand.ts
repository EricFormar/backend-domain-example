import { Brand } from "../../entities/Brand";
import { BadRequestError, createBadRequestError, createConflictError, InvalidDataError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export type BrandCreateRequestModel = Omit<Brand, "id">;
export interface BrandCreateDependencies {
  brandRepository: BrandRepository;
}

export async function brandCreate(
  { brandRepository }: BrandCreateDependencies,
  { name, image }: BrandCreateRequestModel
): Promise<InvalidDataError | Brand> {
  const hasErrors = validateData(name)
  if(hasErrors) throw hasErrors;
  
  const existingBrand = await brandRepository.findByName(name);
  if (existingBrand) throw createConflictError("Name already exists");

  const brand = {
    name,
    image,
  };

  return await brandRepository.create(brand);
}

function validateData(
  name: string
): BadRequestError | void {
  if (name.trim() === "") {
    return createBadRequestError("Name must be not empty");
  }
  if (name.trim().length > 20) {
    return createBadRequestError("Name cannot be longer than 20 characters");
  }
}
