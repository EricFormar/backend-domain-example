import { Brand } from "../entities/Brand";

export function createBrandMock(opts : Partial<Brand> = {}) {
    return {
        id : 1,
        name : "any-brand",
        image : "any-image",
        ...opts
    }
}