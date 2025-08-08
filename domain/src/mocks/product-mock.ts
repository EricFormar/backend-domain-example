import { Product } from "../entities/Product";

export function createProductMock(opts: Partial<Product> = {}) {
    return {
        id: 'id-any',
        name: 'any product',
        description: 'any description',
        price: 100,
        image : "any-image",
        discount : 0,
        stock : 100,
        category: {
            id : 'any-category-id',
            name : 'any-category-name'
        },
        brand : {
            id : "any-brand-id",
            name : "any-brand-name"
        },
        ...opts
    }
}