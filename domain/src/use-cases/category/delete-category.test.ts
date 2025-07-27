import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createCategoryRepositoryMock, MockedCategoryRepository } from "../../mocks/category-repository-mock";
import { createCategoryMock } from "../../mocks/category-mock";
import { deleteCategory, DeleteCategoryDependencies } from "./delete-category";

describe("Delete category", () => {
  const _mockedCategoryRepository: MockedCategoryRepository =
    createCategoryRepositoryMock([
      createCategoryMock({ id: "any-id" }),
      createCategoryMock({ id: "other-id" }),
    ]);

  let _dependencies: DeleteCategoryDependencies;

  beforeEach(() => {
    _dependencies = {
      categoryRepository: _mockedCategoryRepository,
    };
  });

  test("should get category by id", async () => {
    const categoryId = "any-id";
    const result = await deleteCategory(_dependencies, { id: categoryId });
    expect(result).toBe(true);
  });

  test("should throw error when category id does not exist", async () => {
    const categoryId = "non-exist-id";
    const result = await deleteCategory(_dependencies, {
      id: categoryId,
    });
    expect(result).toEqual(createNotFoundError("Category not found"));
  });
});
