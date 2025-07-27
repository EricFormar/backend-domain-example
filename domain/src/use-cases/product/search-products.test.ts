import { describe, test, expect, beforeEach } from "vitest";
import {
  createProductRepositoryMock,
  MockedProductRepository,
} from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import {
  SearchProductDependencies,
  SearchProductRequestModel,
  searchProducts,
} from "./search-products";

describe("Search products", async () => {
  const _mockedProductRepository: MockedProductRepository =
    createProductRepositoryMock([
      createProductMock({ id: "any-id", name: "any-product", price: 100 }),
      createProductMock({ id: "other-id", name: "other-product", price: 200 }),
      createProductMock({ id: "other-id", name: "other-product", price: 300 }),
      createProductMock({
        id: "other-id",
        description: "some-description",
        price: 200,
      }),
      createProductMock({
        id: "other-id",
        description: "some-description",
        price: 300,
      }),
    ]);

  let _dependencies: SearchProductDependencies;

  beforeEach(() => {
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  test("Should search for products by name", async () => {
    const search : SearchProductRequestModel = {
      dataToSearch : {
        name: "other",
      }
    };
    const result = await searchProducts(_dependencies, search);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([
      _mockedProductRepository.products[1],
      _mockedProductRepository.products[2],
    ]);
  });

  test("should search for products by description", async () => {
   const search : SearchProductRequestModel = {
      dataToSearch : {
        description: "some",
      }
    };
    const result = await searchProducts(_dependencies, search);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([
      _mockedProductRepository.products[3],
      _mockedProductRepository.products[4],
    ]);
  });
});
