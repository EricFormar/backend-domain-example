import { Category } from "../entities/Category";

export function createCategoryMock(opts : Partial<Category> = {}) {
    return {
        id : "any-id",
        name : "any category",
        image : "any image",
        ...opts
    }
}