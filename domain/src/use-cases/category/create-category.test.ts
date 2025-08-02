import { beforeEach, describe, expect, it } from "vitest";
import { createCategoryRepositoryMock, MockedCategoryRepository } from "../../mocks/category-repository-mock";
import { createCategoryMock } from "../../mocks/category-mock";
import { categoryCreate, CategoryCreateDependencies, CategoryCreateRequestModel } from "./create-category";

describe("Create Category", () => {
  const _mockedCategoryRepository : MockedCategoryRepository= createCategoryRepositoryMock([
    createCategoryMock({id: "any-id"}),
    createCategoryMock({id: "other-id"}),
  ]);

  let _dependencies : CategoryCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      categoryRepository : _mockedCategoryRepository
    }
  })


  it("should create new brand successfully", async () => {
    const payload : CategoryCreateRequestModel = {
      name: "new-brand",
      image: "any-image",
    };
    const result = await categoryCreate(_dependencies, payload)

    expect(result).toEqual({
      id: "new-id",
      name: "new-brand",
      image: "any-image",
    });
  });

  it("should throw error when name is empty", async () => {
    const payload = {
      name: "",
    };
    await expect(categoryCreate(_dependencies, payload)).rejects.toThrow(
      "Name must be not empty"
    );

  });

  it("should throw error when name is too long", async () => {
    const payload = {
      name: "a".repeat(21),
    };

    await expect(categoryCreate(_dependencies, payload)).rejects.toThrow(
      "Name cannot be longer than 20 characters"
    );
  });
});
