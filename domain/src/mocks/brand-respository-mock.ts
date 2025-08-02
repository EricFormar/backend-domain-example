import { Brand } from "../entities/Brand";
import { BrandRepository } from "../repositories/brand-repository";

export interface MockedBrandRepository extends BrandRepository {
  brands: Brand[];
}

export function createBrandRepositoryMock(
  brands: Brand[] = []
): MockedBrandRepository {
  return {
    brands,
    findAll: async function () {
      return this.brands;
    },
    findById: async function (brandId: string) {
      const brand = this.brands.find((brand) => brand.id === brandId);
      return brand || null;
    },
    create: async function (brand: Omit<Brand, "id">): Promise<Brand> {
      const newBrand = {
        id: "new-id",
        ...brand,
      };
      this.brands.push(newBrand);
      return newBrand;
    },
    update: async function (brand: Brand): Promise<Brand> {
      const index = this.brands.findIndex((b) => b.id === brand.id);
      if (index !== -1) {
        this.brands[index] = brand;
      }
      return brand;
    },
    delete: async function (brandId: string): Promise<void> {
      const index = this.brands.findIndex((b) => b.id === brandId);
      if (index !== -1) {
        this.brands.splice(index, 1);
      }
    },
    findByName: async function (name: string): Promise<Brand | null> {
      const brand = this.brands.find((brand) => brand.name === name);
      return brand || null;
    },
  };
}
