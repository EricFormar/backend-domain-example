import { Product } from "../entities/Product";

export function createProductMock(opts: Partial<Product> = {}) {
    return {
        id: 'id-any',
        name: 'any product',
        description: 'any description',
        price: 100,
        image : "any-image",
        discount : 0,
        categoryId: 'any-category-id',
        brandId : "any-brand-id",
        ...opts
    }
}