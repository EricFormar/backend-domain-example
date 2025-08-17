import { Product } from "src/entities/Product";
import { PurchaseItem } from "src/entities/PurchaseItem";
import { PurchaseOrder, PurchaseStatus } from "src/entities/PurchaseOrder";

export interface PurchaseOrderRepository {
    createNewPurchaseOrder(order : Omit<PurchaseOrder, "id">) : Promise<PurchaseOrder>;
    updateStatus(order : PurchaseOrder, newStatus : PurchaseStatus) : Promise<PurchaseOrder>;
    findOrderById(id : string): Promise<PurchaseOrder | null> ;
    addProductInOrder(order: PurchaseOrder, product: Product) : Promise<PurchaseOrder>;
    findProductInOrder(product : Product, order : PurchaseOrder) : Promise<PurchaseItem | null>
    emptyPurchaseOrder(order : Pick<PurchaseOrder, "id">) : Promise<PurchaseOrder>;
    removeItemFromOrder(order: Pick<PurchaseOrder, "id">, idItem : string) : Promise<PurchaseOrder>;
    findItemInOrder(idItem : string, idOrder : string) : Promise<PurchaseItem | null>
}