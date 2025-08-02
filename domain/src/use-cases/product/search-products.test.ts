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
      createProductMock({
        id: "any-id",
        name: "any-product",
        price: 100,
        category: { id: "any-category-id", name: "any-category-name" },
        brand: { id: "any-brand-id", name: "any-brand-name" },
      }),
      createProductMock({
        id: "other-id",
        name: "other-product",
        price: 200,
        category: { id: "other-category-id", name: "other-category-name" },
      }),
      createProductMock({
        id: "other-id",
        name: "other-product",
        price: 300,
        category: { id: "other-category-id", name: "other-category-name" },
      }),
      createProductMock({
        id: "some-id",
        description: "some-description",
        price: 200,
        brand: { id: "some-brand-id", name: "some-brand-name" },
      }),
      createProductMock({
        id: "some-id",
        description: "some-description",
        price: 300,
        brand: { id: "some-brand-id", name: "some-brand-name" },
      }),
    ]);

  let _dependencies: SearchProductDependencies;

  beforeEach(() => {
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  test("Should search for products by name", async () => {
    const search: SearchProductRequestModel = {
      dataToSearch: {
        name: "other",
      },
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
    const search: SearchProductRequestModel = {
      dataToSearch: {
        description: "some",
      },
    };
    const result = await searchProducts(_dependencies, search);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([
      _mockedProductRepository.products[3],
      _mockedProductRepository.products[4],
    ]);
  });

  test("should search for products by brand", async () => {
    const search: SearchProductRequestModel = {
      dataToSearch: {
        brand: { id: "some-brand-id", name: "some-brand-name" },
      },
    };
    const result = await searchProducts(_dependencies, search);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([
      _mockedProductRepository.products[3],
      _mockedProductRepository.products[4],
    ]);
  });

  test("should search for products by category", async () => {
    const search: SearchProductRequestModel = {
      dataToSearch: {
        category: { id: "other-category-id", name: "other-category-name" },
      },
    };
    const result = await searchProducts(_dependencies, search);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result).toEqual([
      _mockedProductRepository.products[1],
      _mockedProductRepository.products[2],
    ]);
  });
});
