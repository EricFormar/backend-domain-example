import { PurchaseOrderRepository } from "@domain/repositories/purchase-order-repository";
import OrderModel from "../database/models/order";
import UserModel from "../database/models/user";
import {
  PurchaseItemResponseDto,
  PurchaseOrderResponseDto,
} from "src/dtos/purchase-order-response.dto";
import { PurchaseOrder, PurchaseStatus } from "@domain/entities/PurchaseOrder";
import StatusModel from "src/database/models/status";
import ProductModel from "src/database/models/product";
import { Product } from "@domain/entities/Product";
import ItemModel from "src/database/models/item";
import { PurchaseItem } from "@domain/entities/PurchaseItem";
import { createInternalServerError, createNotFoundError } from "@domain/index";
import { UserInPurchaseOrder } from "../dtos/user-in-purchase-order";
import Order from "../database/models/order";

export function purchaseOrderService(): PurchaseOrderRepository {
  const _mapToPurchaseItemResponseDto = (
    item: ItemModel
  ): PurchaseItemResponseDto => {
    try {
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
    } catch (error) {
      throw createInternalServerError("Error al crear items dto");
    }
  };

  const _mapToPurchaseOrderResponseDto = (
    order: OrderModel
  ): PurchaseOrderResponseDto => {
    try {
      return {
        id: order.id.toString(),
        total: order.total,
        status: _mapStatusPurchaseOrderDto(order.status) as PurchaseStatus,
        date: order.createdAt,
        buyer: _mapToUserPurchaseResponseDto(order.user),
        items: order.items.map((item) => {
          return _mapToPurchaseItemResponseDto(item);
        }),
      };
    } catch (error) {
      throw createInternalServerError("Error al crear order dto");
    }
  };

  const _mapToUserPurchaseResponseDto = (
    user: UserModel
  ): UserInPurchaseOrder => {
    try {
      return {
        id: user.id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
      };
    } catch (error) {
      throw createInternalServerError("Error al user order dto");
    }
  };

  const _mapStatusPurchaseOrderDto = (status: StatusModel) => {
    return status.name.toLowerCase();
  };

  return {
    createNewPurchaseOrder: async function (order: Omit<PurchaseOrder, "id">) {
      const status = await StatusModel.findOne({
        where: { name: order.status },
      });
      if (!status)
        throw createNotFoundError("No existe el estado proporcionado");
      const newOrder = await OrderModel.create({
        ...order,
        userId: order.buyer.id,
        statusId: status.id,
      });

      const orderCreated = (await this.findOrderById(
        newOrder.id.toString()
      )) as PurchaseOrder;

      return orderCreated;
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
          {
            association: "status",
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
      let itemsUpdated;
      if (!created) {
        await item.increment("quantity", { by: 1 });
        itemsUpdated = purchaseOrder.items?.map((purchaseItem) => {
          if (purchaseItem.id == item.id.toString()) {            
            purchaseItem = _mapToPurchaseItemResponseDto({
              ...item.dataValues,
              quantity : item.quantity + 1
            });
          }
          return purchaseItem;
        });        
      } else {
        itemsUpdated = purchaseOrder.items?.push(_mapToPurchaseItemResponseDto(item));
      }
      return {
        ...purchaseOrder,
        items : itemsUpdated as PurchaseItem[]
      }
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
    removeItemFromOrder: async function (order: PurchaseOrder, idItem: string) {
      const itemToRemove = await ItemModel.findOne({
        where: {
          id: idItem,
          orderId: order.id,
        },
      });
      if (itemToRemove) await itemToRemove.destroy();
      const purchaseOrderUpdated = await OrderModel.findByPk(order.id, {
        include: [
          {
            association: "user",
          },
          {
            association: "items",
            include: ["product"],
          },
          {
            association: "status",
          },
        ],
      });
      return _mapToPurchaseOrderResponseDto(purchaseOrderUpdated as Order);
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
    findItemInOrder: async function (
      idItem: string,
      idOrder: string
    ): Promise<PurchaseItem | null> {
      const item = await ItemModel.findOne({
        where: {
          id: idItem,
          orderId: idOrder,
        },
        include: ["product"],
      });

      return item ? _mapToPurchaseItemResponseDto(item) : null;
    },
  };
}
