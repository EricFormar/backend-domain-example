import { beforeEach, describe, expect, it, test } from "vitest";
import {
  createProductRepositoryMock,
  MockedProductRepository,
} from "../../mocks/product-repository-mock";
import { createProductMock } from "../../mocks/product-mock";
import {
  productCreate,
  ProductCreateDependencies,
  ProductCreateRequestModel,
} from "./create-product";

describe("Create Product", () => {
  const _mockedProductRepository: MockedProductRepository =
    createProductRepositoryMock([
      createProductMock({ id: "any-id" }),
      createProductMock({ id: "other-id" }),
    ]);

  let _dependencies: ProductCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      productRepository: _mockedProductRepository,
    };
  });

  it("should create new product successfully", async () => {
    const payload: ProductCreateRequestModel = {
      name: "new-product",
      description: "new-description",
      image : "any-image",
      discount : 0,
      price: 100,
    };
    const result = await productCreate(_dependencies, payload);

    expect(result).toEqual({
      id: "new-id",
      name: payload.name,
      description: payload.description,
      price: payload.price,
      image : payload.image,
      discount : payload.discount,
    });
  });

  it("should throw error when name is empty", async () => {
    const payload = {
      name: "",
      description: "new-description",
      image : "any-image",
      discount : 0,
      price: 100,
    };
    await expect(productCreate(_dependencies, payload)).rejects.toThrow(
      "Name must be not empty"
    );
  });

  it("should throw error when description is empty", async() => {
    const payload = {
      name: "any-name",
      description: "",
      image : "any-image",
      discount : 0,
      price: 100,
    };
    await expect(productCreate(_dependencies, payload)).rejects.toThrow(
      "Description must be not empty"
    );
  })

  it("should throw error when name is too long", async () => {
    const payload = {
      name: "a".repeat(21),
      description: "new-description",
      image : "any-image",
      discount : 0,
      price: 100,
    };

    await expect(productCreate(_dependencies, payload)).rejects.toThrow(
      "Name cannot be longer than 20 characters"
    );
  });

  test("should throw error when description is too long", async () => {
    const payload = {
      name: "any-name",
      description: "a".repeat(501),
      image : "any-image",
      discount : 0,
      price: 100,
    };

    await expect(productCreate(_dependencies, payload)).rejects.toThrow(
      "Description cannot be longer than 500 characters"
    );
  });

  it("should throw an error when the price is less than or equal to 0", async () => {
    const payload = {
      name: "new-product",
      description: "new-description",
      image : "any-image",
      discount : 0,
      price: 0,
    };
    await expect(productCreate(_dependencies, payload)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
  
});
