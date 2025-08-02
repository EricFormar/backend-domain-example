import { Brand } from "../../entities/Brand";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export interface BrandUpdateDependencies {
  brandRepository: BrandRepository;
}

export interface BrandUpdateRequestModel {
  brandToUpdate: Brand;
}

export async function updateBrand(
  { brandRepository }: BrandUpdateDependencies,
  { brandToUpdate }: BrandUpdateRequestModel
): Promise<Brand | NotFoundError> {
  const brand = await brandRepository.findById(brandToUpdate.id);
  if (!brand) throw createNotFoundError("Brand not found");
  const updatedBrand = await brandRepository.update(brandToUpdate);

  return updatedBrand;
}
