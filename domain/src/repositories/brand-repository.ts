import { Brand } from "../entities/Brand";

export interface BrandRepository {
  findAll(): Promise<Brand[] | Error>;
  findById(brandId: string): Promise<Brand | Error >;
  create(brand: Omit<Brand, "id">): Promise<Brand | Error>;
  update(brand: Partial<Brand>): Promise<Brand | Error>;
  delete(brandId: string): Promise<void | Error>;
  findByName(name: string): Promise<Brand | Error>;
}
