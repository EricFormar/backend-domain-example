import { Brand } from "../entities/Brand";

export interface BrandRepository {
  findAll(): Promise<Brand[]>;
  findById(brandId: number): Promise<Brand | null>;
  create(brand: Omit<Brand, "id">): Promise<Brand>;
  update(brand: Partial<Brand>): Promise<Brand>;
  delete(brandId: number): Promise<void>;
  findByName(name: string): Promise<Brand>;
}
