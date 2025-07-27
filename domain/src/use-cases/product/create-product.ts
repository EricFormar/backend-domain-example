import { Product } from "../../entities/Product";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export type ProductCreateRequestModel = Omit<Product, "id">;
export interface ProductCreateDependencies {
  productRepository: ProductRepository;
}

export async function productCreate(
  { productRepository }: ProductCreateDependencies,
  { name, description, price }: ProductCreateRequestModel
): Promise<InvalidDataError | Product> {
  const hasErrors = validateData(name, description, price);
  if (hasErrors) return hasErrors;

  const product: Product = {
    id: "any-id",
    name,
    description,
    price,
  };

  return await productRepository.create(product);
}

function validateData(
  name: string,
  description: string,
  price: number
): InvalidDataError | void {
  if (name.trim() === "") {
    return createInvalidDataError("Name must be not empty");
  }

  if (name.trim().length > 20) {
    return createInvalidDataError("Name cannot be longer than 20 characters");
  }

  if (description.trim() === "") {
    return createInvalidDataError("Description must be not empty");
  }

  if (description.trim().length > 500) {
    return createInvalidDataError("Description cannot be longer than 500 characters");
  }

   if (price === null) {
    return createInvalidDataError("Price must be not empty");
  }

  if (price <= 0) {
        return createInvalidDataError("Price must be greater than zero");
  }
}
