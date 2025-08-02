import { beforeEach, describe, expect, it } from "vitest";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";
import { brandCreate, BrandCreateDependencies, BrandCreateRequestModel } from "./create-brand";
import { createInvalidDataError } from "../../errors/error";

describe("CreateBrand", () => {
  const _mockedBrandRepository : MockedBrandRepository= createBrandRepositoryMock([
    createBrandMock({id: 1}),
    createBrandMock({id: 2}),
  ]);

  let _dependencies : BrandCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository : _mockedBrandRepository
    }
  })


  it("should create new brand successfully", async () => {
    const payload : BrandCreateRequestModel = {
      name: "new-brand",
      image: "any-image",
    };
    const result = await brandCreate(_dependencies, payload)

    expect(result).toEqual({
      id: 1,
      name: payload.name,
      image: payload.image,
    });
  });

  it("should throw error when name is empty", async () => {
    const payload = {
      name: "",
    };
    const result = await brandCreate(_dependencies, payload)
    expect(result).toEqual(createInvalidDataError("Name must be not empty"));

  });

  it("should throw error when name is too long", async () => {
    const payload = {
      name: "a".repeat(21),
    };

    const result = await brandCreate(_dependencies, payload)    
    expect(result).toEqual(createInvalidDataError(
      "Name cannot be longer than 20 characters")
    );
  });
});
