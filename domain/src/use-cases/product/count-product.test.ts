import { describe, test, expect } from "vitest";
import { createProductRepositoryMock, MockedProductRepository } from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import { countProducts } from "./count-products";

describe("Count products", async () => {
  test("Should count products", async () => {
    const productRepository: MockedProductRepository =
      createProductRepositoryMock([
        createProductMock({ id: "any-id" }),
        createProductMock({ id: "other-id" }),
      ]);

    const result = await countProducts({ productRepository });
    expect(result).toBe(2);
  });
});
