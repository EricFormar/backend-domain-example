import { Product } from "../../entities/Product";
import { createInvalidDataError, InvalidDataError } from "../../errors/error";
import { ProductRepository } from "../../repositories/product-repository";

export type ProductCreateRequestModel = Omit<Product, "id">;
export interface ProductCreateDependencies {
  productRepository: ProductRepository;
}

export async function productCreate(
  { productRepository }: ProductCreateDependencies,
  { name, description, price, image, discount, brand, category }: ProductCreateRequestModel
): Promise<InvalidDataError | Product> {
  const hasErrors = validateData(name, description, price);
  if (hasErrors) throw hasErrors;

  const product: Omit<Product, "id"> = {
    name,
    description,
    price,
    image,
    discount,
    brand,
    category,
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

  if (price <= 0) {
        return createInvalidDataError("Price must be greater than zero");
  }
}
