import { createNotFoundError, NotFoundError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export interface DeleteBrandDependencies {
  brandRepository: BrandRepository;
}

export interface DeleteBrandRequestModel {
  id: string;
}

export async function deleteBrand(
  { brandRepository }: DeleteBrandDependencies,
  { id }: DeleteBrandRequestModel
): Promise<Boolean | NotFoundError > {
  const result = await brandRepository.delete(id);
  if (!result) return createNotFoundError("Brand not found");
  return result;
}
