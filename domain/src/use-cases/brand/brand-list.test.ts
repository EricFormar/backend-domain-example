import { describe, test, expect } from "vitest";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";
import { listBrands } from "./brand-list";

describe('List Brands', async () => {

    test('Given any user, list the brands', async () => {
        const brandRepository: MockedBrandRepository = createBrandRepositoryMock([
            createBrandMock({ id: "any-id" }),
            createBrandMock({ id: "other-id" })
        ]);

        const brands = await listBrands({ brandRepository });
        expect(brands).toHaveLength(2);

    })
});
