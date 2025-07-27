import { Brand } from "../../entities/Brand";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export interface BrandUpdateDependencies {
  brandRepository: BrandRepository;
}

export interface BrandUpdtateRequestModel {
  brandToUpdate: Brand;
}

export async function updateBrand(
  { brandRepository }: BrandUpdateDependencies,
  { brandToUpdate }: BrandUpdtateRequestModel
): Promise<Brand | NotFoundError> {
  const brand = await brandRepository.findById(brandToUpdate.id);
  if (!brand) return createNotFoundError("Brand not found");
  const updatedBrand = await brandRepository.update(brandToUpdate);

  return updatedBrand;
}
