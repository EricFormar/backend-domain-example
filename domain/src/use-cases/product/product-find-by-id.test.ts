import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import {
  createProductRepositoryMock,
  MockedProductRepository,
} from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import {
  findProductById,
  ProductFindByIdDependencies,
} from "./product-find-by-id";

describe("Find Product by ID", () => {
  const _mockedProductRepository: MockedProductRepository =
    createProductRepositoryMock([
      createProductMock({ id: "any-id" }),
      createProductMock({ id: "other-id" }),
    ]);

  let _dependencies: ProductFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  test("should get product by id", async () => {
    const productId = "any-id";
    const result = await findProductById(_dependencies, { id: productId });

    expect(result).toHaveProperty("id", productId);
  });

  test("should throw error when product id does not exist", async () => {
    const productId = "non-exist-id";
    await expect(
      findProductById(_dependencies, {
        id: productId,
      })
    ).rejects.toThrow("Product not found");
  });
});
