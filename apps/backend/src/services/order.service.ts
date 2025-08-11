import { PurchaseOrderRepository } from "@domain/repositories/purchase-order-repository";
import OrderModel from "../database/models/order";
import {
  PurchaseItemResponseDto,
  PurchaseOrderResponseDto,
} from "src/dtos/purchase-order-response.dto";
import {
  PurchaseOrder,
  PurchaseStatus,
} from "@domain/entities/PurchaseOrder";
import StatusModel from "src/database/models/status";
import ProductModel from "src/database/models/product";
import { Product } from "@domain/entities/Product";
import ItemModel from "src/database/models/item";
import { PurchaseItem } from "@domain/entities/PurchaseItem";

export function purchaseOrderService(): PurchaseOrderRepository {
  const _mapToPurchaseItemResponseDto = (
    item: ItemModel
  ): PurchaseItemResponseDto => {
    return {
      id: item.id.toString(),
      quantity: item.quantity,
      product: {
        id: item.product.id.toString(),
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        discount: item.product.discount,
      },
    };
  };
  const _mapToPurchaseOrderResponseDto = (
    order: OrderModel
  ): PurchaseOrderResponseDto => {
    return {
      id: order.id.toString(),
      total: order.total,
      status: order.status.name as PurchaseStatus,
      date: order.createdAt,
      buyer: {
        ...order.user,
        id: order.user.id.toString(),
      },
      items: order.items.map((item) => {
        return _mapToPurchaseItemResponseDto(item);
      }),
    };
  };
  return {
    createNewPurchaseOrder: async function (order: Omit<PurchaseOrder, "id">) {
      const newOrder = await OrderModel.create(order);
      return _mapToPurchaseOrderResponseDto(newOrder);
    },
    updateStatus: async function (
      purchaseOrder: PurchaseOrder,
      newStatus: PurchaseStatus
    ) {
      const status = await StatusModel.findOne({ where: { name: newStatus } });
      const purchaseOrderToUpdate = await OrderModel.findByPk(purchaseOrder.id);
      if (purchaseOrderToUpdate && status) {
        purchaseOrderToUpdate.statusId = status.id;
        await purchaseOrderToUpdate.save();
        return _mapToPurchaseOrderResponseDto(purchaseOrderToUpdate);
      }
      return purchaseOrder;
    },
    findOrderById: async function (id: string) {
      const order = await OrderModel.findByPk(id, {
        include: [
          {
            association: "user",
          },
          {
            association: "items",
            include: ["product"],
          },
        ],
      });

      if (!order) return null;
      return _mapToPurchaseOrderResponseDto(order);
    },
    addProductInOrder: async function (
      purchaseOrder: PurchaseOrder,
      newProduct: Product
    ) {
      const order = await OrderModel.findByPk(purchaseOrder.id);
      const product = await ProductModel.findByPk(newProduct.id);
      if (!order || !product) return purchaseOrder;
      const [item, created] = await ItemModel.findOrCreate({
        where: {
          orderId: order.id,
          productId: product.id,
        },
        defaults: {
          quantity: 1,
        },
        include: ["product"],
      });
      if (!created) {
        await item.increment("quantity", { by: 1 });
        purchaseOrder.items?.map((purchaseItem) => {
          if (purchaseItem.id === item.id.toString()) {
            purchaseItem = _mapToPurchaseItemResponseDto(item);
          }
          return purchaseItem;
        });
      } else {
        purchaseOrder.items?.push(_mapToPurchaseItemResponseDto(item));
      }
      return purchaseOrder;
    },
    findProductInOrder: async function (
      product: Product,
      order: PurchaseOrder
    ) {
      const item = await ItemModel.findOne({
        where: {
          orderId: order.id,
          productId: product.id,
        },
      });

      return item ? _mapToPurchaseItemResponseDto(item) : null;
    },
    removeItemFromOrder: async function (
      order: PurchaseOrder,
      item: PurchaseItem
    ) {
      const itemToRemove = await ItemModel.findOne({
        where: {
          id: item.id,
          orderId: order.id,
        },
      });
      if (itemToRemove) {
        await itemToRemove.destroy();
        const purchaseOrderUpdated = await OrderModel.findByPk(order.id, {
          include: ["items", "user"],
        });
        if (purchaseOrderUpdated)
          return _mapToPurchaseOrderResponseDto(purchaseOrderUpdated);
      }

      return order;
    },
    emptyPurchaseOrder: async function (order: PurchaseOrder) {
      await ItemModel.destroy({
        where: {
          orderId: order.id,
        },
      });
      const purchaseOrderUpdated = await OrderModel.findByPk(order.id, {
        include: ["items", "user"],
      });
      if (purchaseOrderUpdated)
        return _mapToPurchaseOrderResponseDto(purchaseOrderUpdated);

      return order;
    },
  };
}
