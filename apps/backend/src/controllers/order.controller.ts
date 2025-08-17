import {
  createBadRequestError,
  createNotFoundError,
  NotFoundError,
} from "@domain/errors/error";
import { Request, Response } from "express";
import { purchaseOrderService } from "@backend/src/services/order.service";
import { productService } from "../../src/services/product.service";
import { purchaseOrderCreate } from "@domain/use-cases/purchase/create-purchase-order";
import { findPurchaseOrderById } from "@domain/use-cases/purchase/find-purchase-order-by-id";
import { userService } from "../services/user.service";
import { findProductById } from "@domain/use-cases/product/product-find-by-id";
import { createErrorResponse } from "../utils/createErrorResponse";
import { removeProductToPurchaseItem } from "@domain/use-cases/purchase/remove-item-purchase";
import { addProductToPurchaseItem } from "@domain/use-cases/purchase/add-product-item-purchase";
export function purchaseOrderController() {
  return {
    createNewPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { total, date, status, buyer } = req.body;
        const newOrder = await purchaseOrderCreate(
          {
            purchaseOrderRepository: purchaseOrderService(),
            userRepository: userService(),
          },
          {
            total,
            date,
            status,
            buyer,
          }
        );
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${
              "id" in newOrder ? newOrder.id : ""
            }`,
          },
          data: newOrder,
          message: "Orden de compra creada con éxito",
        });
      } catch (e) {
        const error = createErrorResponse(e);
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    findOrderById: async (req: Request, res: Response) => {
      try {
        const { idOrder } = req.params;

        const order = await findPurchaseOrderById(
          { purchaseOrderRepository: purchaseOrderService() },
          { id: idOrder }
        );
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${
              "id" in order ? order.id : ""
            }`,
          },
          data: order,
          message: "Orden de compra encontrada con éxito",
        });
      } catch (e) {
        const error = createErrorResponse(e);
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Add product to purchase
    addProductToPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { idOrder, idProduct } = req.params;

        if (!idOrder)
          throw createBadRequestError("El ID del pedido es requerido");
        const order = await findPurchaseOrderById(
          { purchaseOrderRepository: purchaseOrderService() },
          { id: idOrder }
        );
        if (order instanceof NotFoundError)
          throw createNotFoundError("Pedido no encontrado");
        if (!idProduct)
          throw createBadRequestError("El ID del producto es requerido");

        const product = await findProductById(
          { productRepository: productService() },
          { id: idProduct }
        );

        if (product instanceof NotFoundError)
          throw createNotFoundError("No hay producto para agregar");
        
        const purchaseOrderUpdated =  await addProductToPurchaseItem(
          {
            purchaseOrderRepository: purchaseOrderService(),
            productRepository: productService(),
          },
          {
            order,
            product,
          }
        );
          return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${
              "id" in purchaseOrderUpdated ? purchaseOrderUpdated.id : ""
            }`,
          },
          data: purchaseOrderUpdated,
          message: "Producto agregado con éxito",
        });
      } catch (e) {
        const error = createErrorResponse(e);
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    removeItemToPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { idItem, idOrder } = req.params;
        const orderUpdated = await removeProductToPurchaseItem(
          {
            purchaseOrderRepository: purchaseOrderService(),
          },
          {
            idItem,
            order: {
              id: idOrder,
            },
          }
        );
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${
              "id" in orderUpdated ? orderUpdated.id : ""
            }`,
          },
          data: orderUpdated,
          message: "Item de compra eliminado con éxito",
        });
      } catch (e) {
        console.log(e);
        
        const error = createErrorResponse(e);
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}
