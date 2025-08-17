import { Product } from "src/entities/Product";
import { PurchaseItem } from "src/entities/PurchaseItem";
import { PurchaseOrder } from "src/entities/PurchaseOrder";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";
import { createPurchaseItemMock } from "./purchase-item-mock.";

export interface MockedPurchaseOrderRepository extends PurchaseOrderRepository {
  orders: PurchaseOrder[];
}

export function createPurchaseOrderRepositoryMock(
  orders: PurchaseOrder[] = []
): MockedPurchaseOrderRepository {
  return {
    orders,
    createNewPurchaseOrder: async function (order) {
      const newOrder = {
        id: "new-id",
        ...order,
      };
      return newOrder;
    },
    updateStatus: async function (order, newStatus) {
      const index = this.orders.findIndex((o) => o.id === order.id);
      if (index !== -1) {
        this.orders[index].status = newStatus;
      }
      return orders[index];
    },
    findOrderById: async function (id) {
      return this.orders.find((order) => order.id === id) || null;
    },
    addProductInOrder: async function (
      order: PurchaseOrder,
      product: Product
    ): Promise<PurchaseOrder> {
      const existingItemIndex = order.items?.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex !== -1 && existingItemIndex !== undefined) {
        order.items![existingItemIndex].quantity++;
      } else {
        const newItem = createPurchaseItemMock({ product });
        order.items?.push(newItem);
      }
      return order;
    },
    findProductInOrder: async function (
      product: Product,
      order: PurchaseOrder
    ) {
      const item = order.items?.find((item) => item.product.id === product.id);
      return item || null;
    },
    findItemInOrder: async function (
      idItem: string,
      idOrder: string
    ) {
      const order = this.orders.find(order => order.id === idOrder)
      const item = order?.items?.find((item) => item.id === idItem);
      return item || null;
    },
    removeItemFromOrder: async function (
      order: PurchaseOrder,
      idItem: string
    ): Promise<PurchaseOrder> {
      const updatedItems = order?.items?.filter(item => item.id !== idItem);
      const updatedOrder = {
        ...order,
        items: updatedItems,
      };
      return updatedOrder;
    },
    emptyPurchaseOrder: async function (
      order: PurchaseOrder
    ): Promise<PurchaseOrder> {
      return {
        ...order,
        items: [],
      };
    },
  };
}
