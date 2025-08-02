import { beforeEach, describe, expect, it } from "vitest";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createNotFoundError } from "../../errors/error";
import { createBrandMock } from "../../mocks/brand-mock";
import { BrandFindByIdDependencies, findBrandById } from "./brand-find-by-id";

describe("Find Brand by ID", () => {
  const _mockedBrandRepository : MockedBrandRepository= createBrandRepositoryMock([
    createBrandMock({id: 1}),
    createBrandMock({id: 2}),
  ]);

  let _dependencies :BrandFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository : _mockedBrandRepository
    }
  })

  it("should return a brand by id", async () => {
    const brandId = 1;
    const result = await findBrandById(_dependencies,{id : brandId});

    expect(result).toHaveProperty('id', brandId);
  });

  it("should return error if brand not found", async () => {
    const brandId = 1000;
    const result = await findBrandById(_dependencies, {
      id : brandId
    });
    expect(result).toEqual(createNotFoundError("Brand not found"))
  }); 
});
