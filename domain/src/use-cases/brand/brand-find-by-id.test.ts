import { beforeEach, describe, expect, it } from "vitest";
import {
  createBrandRepositoryMock,
  MockedBrandRepository,
} from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";
import { BrandFindByIdDependencies, findBrandById } from "./brand-find-by-id";

describe("Find Brand by ID", () => {
  const _mockedBrandRepository: MockedBrandRepository =
    createBrandRepositoryMock([
      createBrandMock({ id: "any-id" }),
      createBrandMock({ id: "other-id" }),
    ]);

  let _dependencies: BrandFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository: _mockedBrandRepository,
    };
  });

  it("should return a brand by id", async () => {
    const brandId = "any-id";
    const result = await findBrandById(_dependencies, { id: brandId });

    expect(result).toHaveProperty("id", brandId);
  });

  it("should return error if brand not found", async () => {
    const brandId = "unexistent-id";
    await expect(
      findBrandById(_dependencies, {
        id: brandId,
      })
    ).rejects.toThrow("Brand not found");
  });
});
