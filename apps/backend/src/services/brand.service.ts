import { default as BrandModel } from "../database/models/brand";
import { BrandRepository } from "@project-example/domain/repositories/brand-repository";
import { BrandResponseDto } from "../dtos/brand-response.dto";
import { Brand } from "@project-example/domain/entities/Brand";

export function brandService(): BrandRepository {
  const _mapToBrandResponseDto = (brand: BrandModel): BrandResponseDto => {
    return {
      id: brand.id,
      name: brand.name,
      image: brand.image,
    };
  };
  return {
    // Get all brand
    findAll: async function () {
      const brands = await BrandModel.findAll();
      const mappedBrands: Brand[] = brands.map((brand: BrandModel) =>
        _mapToBrandResponseDto(brand)
      );
      return mappedBrands;
    },
    // Get brand by id
    findById: async function (brandId: number) {
      const brand = await BrandModel.findByPk(brandId);
      return brand ? _mapToBrandResponseDto(brand) : null;
    },
    // Create brand
    create: async function (brand: Omit<Brand, "id">) {
      const newBrand = await BrandModel.create(brand);
      return _mapToBrandResponseDto(newBrand);
    },
    // Update brand
    update: async function (brand: Brand) {
      const brandToUpdate = await BrandModel.findByPk(brand.id);
      if (brandToUpdate) {
        brandToUpdate.update(brand);
        const brandUpdated = await brandToUpdate.save();
        return _mapToBrandResponseDto(brandUpdated);
      } else {
        return brand;
      }
    },
    // Delete brand
    delete: async function (id: number) {
      const brandToDelete = await BrandModel.findByPk(id);
      brandToDelete && (await brandToDelete.destroy());
      return;
    },
    // Find brand by name
    findByName: async function (name: string) {
      const brand = await BrandModel.findOne({
        where: { name },
      });
      return brand ? _mapToBrandResponseDto(brand) : null;
    },
  };
}
