import { Brand } from "../../entities/Brand";
import { BrandRepository } from "../../repositories/brand-repository";

export interface ListBrandDependencies {
    brandRepository : BrandRepository
};

export interface ListBrandResponseModel {
    brands : Brand[]
}

export async function listBrands({brandRepository} : ListBrandDependencies) : Promise<ListBrandResponseModel> {
    
    const brands = await brandRepository.findAll();

    return {
        brands
    }
}