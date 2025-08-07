import { beforeEach, describe, expect, it, test } from "vitest";
import {
  createBrandRepositoryMock,
  MockedBrandRepository,
} from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";
import {
  brandCreate,
  BrandCreateDependencies,
  BrandCreateRequestModel,
} from "./create-brand";
import { createBadRequestError, createConflictError } from "../../errors/error";

describe("CreateBrand", () => {
  const _mockedBrandRepository: MockedBrandRepository =
    createBrandRepositoryMock([
      createBrandMock({ id: "any-id" }),
      createBrandMock({ id: "other-id" }),
      createBrandMock({ id: "exist-id", name :"exist-name" })
    ]);

  let _dependencies: BrandCreateDependencies;

  beforeEach(() => {
    _dependencies = {
      brandRepository: _mockedBrandRepository,
    };
  });

  test("should throw error when name is exists", async () => {
    const payload = {
      name: "exist-name",
    };
    await expect(brandCreate(_dependencies, payload)).rejects.toThrow(
      createConflictError("Name already exists")
    );
  });

  it("should create new brand successfully", async () => {
    const payload: BrandCreateRequestModel = {
      name: "new-brand",
      image: "any-image",
    };
    const result = await brandCreate(_dependencies, payload);

    expect(result).toEqual({
      id: "new-id",
      name: payload.name,
      image: payload.image,
    });
  });

  it("should throw error when name is empty", async () => {
    const payload = {
      name: "",
    };
    await expect(brandCreate(_dependencies, payload)).rejects.toThrow(
      createBadRequestError("Name must be not empty")
    );
  });

  it("should throw error when name is too long", async () => {
    const payload = {
      name: "a".repeat(21),
    };

    await expect(brandCreate(_dependencies, payload)).rejects.toThrow(
      createBadRequestError("Name cannot be longer than 20 characters")
    );
  });
});
