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
      if (!brand)
        throw createNotFoundError(
          "No existe una marca con el ID " + brandId
        );
      return _mapToBrandResponseDto(brand)
    },
    // Create brand
    create: async function (brand: Omit<Brand, "id">) {
      const newBrand = await BrandModel.create(brand);
      return _mapToBrandResponseDto(newBrand);
    },
    // Update brand
    update: async function (brand: Brand) {
      const brandToUpdate = await BrandModel.findByPk(brand.id);
      if (!brandToUpdate)
        throw createNotFoundError(
          "No existe una marca con el ID " + brand.id
        );
      brandToUpdate.update(brand);
      const brandUpdated = await brandToUpdate.save();
      return _mapToBrandResponseDto(brandUpdated);
    },
    // Delete brand
    delete: async function (id: number) {
      const brandToDelete = await BrandModel.findByPk(id);
      if (!brandToDelete) {
        throw createNotFoundError(
          "No existe una marca con el ID " + id
        );
      }
      await brandToDelete.destroy();
      return;
    },
    // Find brand by name
    findByName: async function (name: string) {
      const brand = await BrandModel.findOne({
        where: { name }
      });
      if (!brand)
        throw createNotFoundError("No existe una marca con el nombre " + name);
      return _mapToBrandResponseDto(brand);
    }
  };
}
