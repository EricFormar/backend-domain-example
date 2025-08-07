import { Product } from "src/entities/Product";
import { PurchaseItem } from "src/entities/PurchaseItem";
import { PurchaseOrder } from "src/entities/PurchaseOrder";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";
import { createPurchaseItemMock } from "./purchase-item-mock.";

export interface MockedPurchaseOrderRepository extends PurchaseOrderRepository {
    orders : PurchaseOrder[]
}


export function createPurchaseOrderRepositoryMock(
    orders : PurchaseOrder[] = []
) : MockedPurchaseOrderRepository {
    return {
        orders,
        create : async function (order){
            const newOrder = {
                id : "new-id",
                ...order
            }
            return newOrder
        },
        updateStatus : async function (order, newStatus) {
            const index = this.orders.findIndex(o => o.id === order.id);
            if (index !== -1) {
                this.orders[index].status = newStatus;
            }
            return orders[index]
        },
        findOrderById : async function (id) {
            return this.orders.find(order => order.id === id) || null
        },
        addProductInOrder : async function(order: PurchaseOrder, product: Product) : Promise<PurchaseOrder> {
            const item = order.items?.find(item => item.product.id === product.id)
            if(item){
                ++item.quantity;
                order.items = [
                    ...order.items as PurchaseItem[],
                    item
                ]
            }else {
                const newItem = createPurchaseItemMock({
                    product
                })
                order.items?.push(newItem)
            }
            return order
        },
        findProductInOrder : async function(product : Product, order: PurchaseOrder) {
            const item = order.items?.find(item => item.product.id === product.id)
            return item || null
        },
        removeItemFromOrder : async function(order : PurchaseOrder, item: PurchaseItem) : Promise<PurchaseOrder>{
            const itemsFiltered = order.items?.filter(i => i.id !== item.id);
            return {
                ...order,
                items : itemsFiltered
            }
        },
        emptyPurchaseOrder : async function(order : PurchaseOrder) : Promise<PurchaseOrder> {
            return {
                ...order,
                items : []
            }
        }
    }   
}