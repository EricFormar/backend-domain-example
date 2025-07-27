import { Brand } from "../entities/Brand";

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findById(brandId: string): Promise<Brand | null>;
  create(brand: Omit<Brand, "id">): Promise<Brand>;
  update(brand: Partial<Brand>): Promise<Brand>;
  delete(brandId: string): Promise<boolean>;
  findByName(name: string): Promise<Brand | null>;
}
