import {
  AppError,
  createBadRequestError,
  createInternalServerError,
  createNotFoundError,
  NotFoundError,
} from "@domain/errors/error";
import { addProductToPurchaseItem } from "@domain/use-cases/purchase/add-product-item-purchase";
import { Request, Response } from "express";
import { purchaseOrderService } from "@backend/src/services/order.service";
import { productService } from "../../src/services/product.service";
import { purchaseOrderCreate } from "@domain/use-cases/purchase/create-purchase-order";
import { findPurchaseOrderById } from "@domain/use-cases/purchase/find-purchase-order-by-id";
import { userService } from "../services/user.service";
import { findProductById } from "@domain/use-cases/product/product-find-by-id";
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
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${"id" in newOrder ? newOrder.id : ""
              }`,
          },
          data: newOrder,
          message: "Orden de compra creada con éxito",
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al crear un pedido"
            );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    findOrderById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const order = await findPurchaseOrderById(
          { purchaseOrderRepository: purchaseOrderService() },
          { id }
        )

        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get("host")}/api/purchase-orders/${"id" in order ? order.id : ""
              }`,
          },
          data: order,
          message: "Orden de compra encontrada con éxito",
        });


      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al agregar un producto al pedido"
            );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Add product to purchase
    addProductToPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { id, name, image, price, discount } = req.body;
        const { id: orderId } = req.params;

        if (!orderId) throw createBadRequestError("El ID del pedido es requerido");
        const order = await findPurchaseOrderById(
          { purchaseOrderRepository: purchaseOrderService() },
          { id: orderId }
        );
        if (order instanceof NotFoundError) throw createNotFoundError("Pedido no encontrado");

        const product = await findProductById(
          { productRepository: productService() },
          { id }
        )

        if (product instanceof NotFoundError) throw createNotFoundError("No hay producto para agregar")

        return await addProductToPurchaseItem(
          {
            purchaseOrderRepository: purchaseOrderService(),
            productRepository: productService(),
          },
          {
            order,
            product,
          }
        );
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al agregar un producto al pedido"
            );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}
