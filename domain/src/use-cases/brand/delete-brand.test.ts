import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createBrandMock } from "../../mocks/brand-mock";
import { deleteBrand, DeleteBrandDependencies } from "./delete-brand";
import {
  createBrandRepositoryMock,
  MockedBrandRepository,
} from "../../mocks/brand-respository-mock";

describe("Delete brand", () => {
  const _mockedBrandRepository: MockedBrandRepository =
    createBrandRepositoryMock([
      createBrandMock({ id: 1 }),
      createBrandMock({ id: 2 }),
    ]);

  let _dependencies: DeleteBrandDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository: _mockedBrandRepository,
    };
  });

  test("should get brand by id", async () => {
    const brandId = 1;
    const result = await deleteBrand(_dependencies, { id: brandId });
    expect(result).toBeUndefined();
  });

  test("should throw error when brand id does not exist", async () => {
    const brandId = 100;
    await expect(
      deleteBrand(_dependencies, {
        id: brandId,
      })
    ).rejects.toThrow("Brand not found");
  });
});
