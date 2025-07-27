import { Brand } from "../entities/Brand";

export function createBrandMock(opts : Partial<Brand> = {}) {
    return {
        id : "any-id",
        name : "any-brand",
        image : "any-image",
        ...opts
    }
}