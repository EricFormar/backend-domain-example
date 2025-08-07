import { PurchaseOrder } from "src/entities/PurchaseOrder";
import { createUserMock } from "./user-mock";

export function createPurchaseOrderMock(opts: Partial<PurchaseOrder>) : PurchaseOrder {
    return {
        id: 'id-any',
        total : 1,
        status : 'pending',
        date : new Date(),
        buyer : createUserMock({}),
        items : [],
        ...opts
    }
}