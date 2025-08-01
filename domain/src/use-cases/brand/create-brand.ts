import { Brand } from "../../entities/Brand";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
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
  if(hasErrors) return hasErrors;
  
  const existingBrand = await brandRepository.findByName(name);
  if (existingBrand) return createInvalidDataError("Name already in use");

  const brand: Brand = {
    id: 1,
    name,
    image,
  };

  return await brandRepository.create(brand);
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
