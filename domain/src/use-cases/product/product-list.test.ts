import { describe, test, expect } from "vitest";
import { createProductRepositoryMock, MockedProductRepository } from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import { listProducts } from "./product-list";

describe("List Products", async () => {
  test("Given any user, list the categories", async () => {
    const _mockedProductRepository: MockedProductRepository =
      createProductRepositoryMock([
        createProductMock({ id: "any-id" }),
        createProductMock({ id: "other-id" }),
      ]);

    const result = await listProducts({ productRepository : _mockedProductRepository });
    expect(result).toHaveLength(2);
  });

  test("should return an empty array if no categories are found", async () => {
    const _mockedProductRepository: MockedProductRepository =
      createProductRepositoryMock([]);
    const result = await listProducts({ productRepository : _mockedProductRepository });

    expect(result).toEqual([]);
  });
});
