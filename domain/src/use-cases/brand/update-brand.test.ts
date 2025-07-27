import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { BrandFindByIdDependencies } from "./brand-find-by-id";
import { updateBrand } from "./update-brand";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";


describe("Update Brand", () => {
  const _mockedBrandRepository: MockedBrandRepository =
    createBrandRepositoryMock([
      createBrandMock({ id: "any-id", name: "any-name" }),
      createBrandMock({ id: "other-id" }),
    ]);

  let _dependencies: BrandFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository: _mockedBrandRepository,
    };
  });

  test("should update a brand", async () => {
    const brandToUpdate = createBrandMock({ id: "any-id", name: "update-name", image : "update-image"});
    const result = await updateBrand(_dependencies, { brandToUpdate });

    expect(result).toHaveProperty("name", brandToUpdate.name);
    expect(result).toHaveProperty("image", brandToUpdate.image);
  });

  test("should throw error when brand id does not exist", async () => {
    const brandToUpdate = createBrandMock({ id: "non-exist-id", name: "update-name"});
    const result = await updateBrand(_dependencies, {
      brandToUpdate,
    });
    expect(result).toEqual(createNotFoundError("Brand not found"));
  });
});
