import { Brand } from "../../entities/Brand";
import { createNotFoundError, NotFoundError } from "../../errors/error";
import { BrandRepository } from "../../repositories/brand-repository";

export interface BrandFindByIdDependencies {
    brandRepository : BrandRepository
};

export interface FindBrandByIdRequestModel {
  id : string 
}

export async function findBrandById(
  {brandRepository} : BrandFindByIdDependencies,
  {id} : FindBrandByIdRequestModel
) : Promise<Brand | NotFoundError> {
    const brand = await brandRepository.findById(id);      
    if(!brand) throw createNotFoundError("Brand not found")
    return brand 
}