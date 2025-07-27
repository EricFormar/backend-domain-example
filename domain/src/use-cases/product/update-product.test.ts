import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createProductRepositoryMock, MockedProductRepository } from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import { ProductFindByIdDependencies } from "./product-find-by-id";
import { updateProduct } from "./update-product";

describe("Update Product", () => {
  const _mockedProductRepository: MockedProductRepository =
    createProductRepositoryMock([
      createProductMock({ id: "any-id", name: "any-name" }),
      createProductMock({ id: "other-id" }),
    ]);

  let _dependencies: ProductFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  test("should update a product", async () => {
    const productToUpdate = createProductMock({ id: "any-id", name: "update-name" , description : "update-description"});
    const result = await updateProduct(_dependencies, { productToUpdate });

    expect(result).toHaveProperty("name", productToUpdate.name);
  });

  test("should throw error when product id does not exist", async () => {
    const productToUpdate = createProductMock({ id: "non-exist-id", name: "update-name" , description : "update-description"});
    const result = await updateProduct(_dependencies, {
      productToUpdate,
    });
    expect(result).toEqual(createNotFoundError("Product not found"));
  });
});
