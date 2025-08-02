import { createNotFoundError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export interface DeleteBrandDependencies {
  brandRepository: BrandRepository;
}

export interface DeleteBrandRequestModel {
  id: number;
}

export async function deleteBrand(
  { brandRepository }: DeleteBrandDependencies,
  { id }: DeleteBrandRequestModel
): Promise<void> {
  const brand = await brandRepository.findById(id);
  if (!brand) throw createNotFoundError("Brand not found");
  const result = await brandRepository.delete(id);
  return result;
}
