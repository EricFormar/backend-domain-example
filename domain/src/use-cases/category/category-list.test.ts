import { describe, test, expect } from "vitest";
import { listCategory } from "./category-list";
import { createCategoryMock } from "../../mocks/category-mock";
import { CategoryRepositoryMock, createCategoryRepositoryMock } from "../../mocks/category-repository-mock";

describe('List Categories', async () => {

    test('Given any user, list the categories', async () => {
        const categoryRepository: CategoryRepositoryMock = createCategoryRepositoryMock([
            createCategoryMock({ id: "any-id" }),
            createCategoryMock({ id: "other-id" })
        ]);

        const result = await listCategory({ categoryRepository });
        expect(result.categories).toHaveLength(2);

    })
});
