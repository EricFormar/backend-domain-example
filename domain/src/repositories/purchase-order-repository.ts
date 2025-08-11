import { Product } from "src/entities/Product";
import { PurchaseItem } from "src/entities/PurchaseItem";
import { PurchaseOrder, PurchaseStatus } from "src/entities/PurchaseOrder";

export interface PurchaseOrderRepository {
    createNewPurchaseOrder(order : Omit<PurchaseOrder, "id">) : Promise<PurchaseOrder>;
    updateStatus(order : PurchaseOrder, newStatus : PurchaseStatus) : Promise<PurchaseOrder>;
    findOrderById(id : string): Promise<PurchaseOrder | null> ;
    addProductInOrder(order: PurchaseOrder, product: Product) : Promise<PurchaseOrder>;
    findProductInOrder(product : Product, order : PurchaseOrder) : Promise<PurchaseItem | null>
    removeItemFromOrder(order : PurchaseOrder, item: PurchaseItem) : Promise<PurchaseOrder>;
    emptyPurchaseOrder(order : Pick<PurchaseOrder, "id">) : Promise<PurchaseOrder>
}