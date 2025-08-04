import { beforeEach, describe, expect, test } from "vitest";

import { createProductRepositoryMock, MockedProductRepository } from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import { ProductUpdateDependencies, updateProduct } from "./update-product";

describe("Update Product", () => {
  const _mockedProductRepository: MockedProductRepository =
    createProductRepositoryMock([
      createProductMock({ id: "any-id", name: "any-name" }),
      createProductMock({ id: "other-id" }),
    ]);

  let _dependencies: ProductUpdateDependencies;

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
    await expect(updateProduct(_dependencies, {
      productToUpdate,
    })).rejects.toThrow("Product not found")
  });
});
