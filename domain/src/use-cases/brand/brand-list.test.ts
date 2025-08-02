import { describe, test, expect } from "vitest";
import { createBrandRepositoryMock, MockedBrandRepository } from "../../mocks/brand-respository-mock";
import { createBrandMock } from "../../mocks/brand-mock";
import { listBrands } from "./brand-list";

describe('List Brands', async () => {

    test('Given any user, list the brands', async () => {
        const brandRepository: MockedBrandRepository = createBrandRepositoryMock([
            createBrandMock({ id: 1 }),
            createBrandMock({ id: 2 })
        ]);

        const result = await listBrands({ brandRepository });
        expect(result.brands).toHaveLength(2);

    })
});
