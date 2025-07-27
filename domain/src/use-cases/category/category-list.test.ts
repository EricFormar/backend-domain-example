import { describe, test, expect } from "vitest";
import { listCategory } from "./category-list";
import { createCategoryMock } from "../../mocks/category-mock";
import {
  MockedCategoryRepository,
  createCategoryRepositoryMock,
} from "../../mocks/category-repository-mock";

describe("List Categories", async () => {
  test("Given any user, list the categories", async () => {
    const categoryRepository: MockedCategoryRepository =
      createCategoryRepositoryMock([
        createCategoryMock({ id: "any-id" }),
        createCategoryMock({ id: "other-id" }),
      ]);

    const result = await listCategory({ categoryRepository });
    expect(result).toHaveLength(2);
  });

  test("should return an empty array if no categories are found", async () => {
    const categoryRepository: MockedCategoryRepository =
      createCategoryRepositoryMock([]);
    const result = await listCategory({ categoryRepository });

    expect(result).toEqual([]);
  });
});
