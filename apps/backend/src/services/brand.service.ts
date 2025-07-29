import { Brand } from "@domain/src/entities/Brand";
import { default as BrandModel } from "../database/models/brand";

import {
  createNotFoundError,
} from "@domain/src/errors/error";
import { BrandRepository } from "@domain/src/repositories/brand-repository";
import { BrandResponseDto } from "../dtos/brand-response.dto";


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
      try {
        const brands = await BrandModel.findAll();
        const mappedBrands: Brand[] = brands.map((brand: BrandModel) =>
          _mapToBrandResponseDto(brand)
        );
        return mappedBrands;
      } catch (error) {
        return error as Error;
      }
    },
    // Get brand by id
    findById: async function (brandId: string) {
      try {
        const brand = await BrandModel.findByPk(brandId);
        if (!brand)
          throw createNotFoundError("No existe una marca con el ID " + brandId);
        return _mapToBrandResponseDto(brand);
      } catch (error) {
        return error as Error;
      }
    },
    // Create brand
    create: async function (brand: Omit<Brand, "id">) {
      try {
        const newBrand = await BrandModel.create(brand);
        return _mapToBrandResponseDto(newBrand);
      } catch (error) {
        return error as Error;
      }
    },
    // Update brand
    update: async function (brand: Brand) {
      try {
        const brandToUpdate = await BrandModel.findByPk(brand.id);
        if (!brandToUpdate)
          throw createNotFoundError(
            "No existe una marca con el ID " + brand.id
          );
        brandToUpdate.update(brand);
        const brandUpdated = await brandToUpdate.save();
        return _mapToBrandResponseDto(brandUpdated);
      } catch (error) {
        return error as Error;
      }
    },
    // Delete brand
    delete: async function (id: string) {
      try {
        const brandToDelete = await BrandModel.findByPk(id);
        if (!brandToDelete) {
           throw createNotFoundError(
            "No existe una marca con el ID " + id
          );
        }
        await brandToDelete.destroy();
        return;
      } catch (error) {
        return error as Error;
      }
    },
    // Find brand by name
    findByName: async function (name:string) {
       try {
        const brand = await BrandModel.findOne({
          where : {name}
        });
        if (!brand)
          throw createNotFoundError("No existe una marca con el nombre " + name);
        return _mapToBrandResponseDto(brand);
      } catch (error) {
        return error as Error;
      }
    }
  };
}
