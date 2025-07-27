import { beforeEach, describe, expect, test } from "vitest";
import {
  createCategoryRepositoryMock,
  MockedCategoryRepository,
} from "../../mocks/category-repository-mock";
import { createCategoryMock } from "../../mocks/category-mock";
import {
  CategoryFindByIdDependencies,
  findCategoryById,
} from "./category-find-by-id";
import { createNotFoundError } from "../../errors/error";

describe("Find Category by ID", () => {
  const _mockedBrandRepository: MockedCategoryRepository =
    createCategoryRepositoryMock([
      createCategoryMock({ id: "any-id" }),
      createCategoryMock({ id: "other-id" }),
    ]);

  let _dependencies: CategoryFindByIdDependencies;

  beforeEach(() => {
    _dependencies = {
      categoryRepository: _mockedBrandRepository,
    };
  });

  test("should get category by id", async () => {
    const brandId = "any-id";
    const result = await findCategoryById(_dependencies, { id: brandId });

    expect(result).toHaveProperty("id", brandId);
  });

  // Test getCategoryById with non-existing category
  test("should throw error when category id does not exist", async () => {
    const categoryId = "non-exist-id";
    const result = await findCategoryById(_dependencies, {
      id: categoryId,
    });
    expect(result).toEqual(createNotFoundError("Category not found"));
  });
});
