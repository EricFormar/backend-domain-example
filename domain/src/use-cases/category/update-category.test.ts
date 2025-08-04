import { beforeEach, describe, expect, test } from "vitest";

import { createNotFoundError } from "../../errors/error";
import { createCategoryRepositoryMock, MockedCategoryRepository } from "../../mocks/category-repository-mock";
import { createCategoryMock } from "../../mocks/category-mock";
import { CategoryUpdateDependencies, updateCategory } from "./update-category";


describe("Update Category", () => {
  const _mockedCategoryRepository: MockedCategoryRepository =
    createCategoryRepositoryMock([
      createCategoryMock({ id: "any-id", name: "any-name" }),
      createCategoryMock({ id: "other-id" }),
    ]);

  let _dependencies: CategoryUpdateDependencies;

  beforeEach(() => {
    _dependencies = {
      categoryRepository: _mockedCategoryRepository,
    };
  });

  test("should update a category", async () => {
    const categoryToUpdate = createCategoryMock({ id: "any-id", name: "update-name", image : "update-image"});
    const result = await updateCategory(_dependencies, { categoryToUpdate });

    expect(result).toHaveProperty("name", categoryToUpdate.name);
    expect(result).toHaveProperty("image", categoryToUpdate.image);
  });

  test("should throw error when category id does not exist", async () => {
    const categoryToUpdate = createCategoryMock({ id: "non-exist-id", name: "update-name"});
    const result = await updateCategory(_dependencies, {
      categoryToUpdate,
    });
    expect(result).toEqual(createNotFoundError("Category not found"));
  });
});
