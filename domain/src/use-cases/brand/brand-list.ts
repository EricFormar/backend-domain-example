import { Brand } from "../../entities/Brand";
import { BrandRepository } from "../../repositories/brand-repository";

export interface ListBrandDependencies {
    brandRepository : BrandRepository
};

export async function listBrands({brandRepository} : ListBrandDependencies) : Promise<Brand[]> {
    
    return await brandRepository.findAll();

}