import { PurchaseItem } from "src/entities/PurchaseItem";
import { createProductMock } from "./product-mock";

export function createPurchaseItemMock(opts: Partial<PurchaseItem>) : PurchaseItem {
    return {
        id: 'id-any',
        quantity : 1,
        product : createProductMock(),
        ...opts
    }
}