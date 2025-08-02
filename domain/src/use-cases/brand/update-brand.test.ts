import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { BrandUpdateDependencies, updateBrand } from "./update-brand";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";


describe("Update Brand", () => {
  const _mockedBrandRepository: MockedBrandRepository =
    createBrandRepositoryMock([
      createBrandMock({ id: 1, name: "any-name" }),
      createBrandMock({ id: 2 }),
    ]);

  let _dependencies: BrandUpdateDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository: _mockedBrandRepository,
    };
  });

  test("should update a brand", async () => {
    const brandToUpdate = createBrandMock({ id: 1, name: "update-name", image : "update-image"});
    const result = await updateBrand(_dependencies, { brandToUpdate });

    expect(result).toHaveProperty("name", brandToUpdate.name);
    expect(result).toHaveProperty("image", brandToUpdate.image);
  });

  test("should throw error when brand id does not exist", async () => {
    const brandToUpdate = createBrandMock({ id: 100, name: "update-name"});
     await expect(
      updateBrand(_dependencies,{brandToUpdate})
    ).rejects.toThrow("Brand not found");
  });
});
