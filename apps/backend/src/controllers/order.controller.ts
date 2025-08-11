import { AppError, createInternalServerError, NotFoundError } from "@domain/errors/error";
import { addProductToPurchaseItem } from "@domain/use-cases/purchase/add-product-item-purchase";
import { Request, Response } from "express";
import { purchaseOrderService } from "@backend/src/services/order.service";
import { productService } from "src/services/product.service";
import { purchaseOrderCreate } from "@domain/use-cases/purchase/create-purchase-order";
import { findPurchaseOrderById } from "@domain/use-cases/purchase/find-purchase-order-by-id";
import { userService } from "../services/user.service";
export function purchaseOrderController() {
  return {
    createNewPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { total, date, status, buyer } = req.body;
        const newOrder =  await purchaseOrderCreate({
          purchaseOrderRepository: purchaseOrderService(),
          userRepository : userService()
        }, {
          total,
          date,
          status,
          buyer
        });
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/purchase-orders/${('id' in newOrder) ? newOrder.id : ''}`
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
    // Add product to purchase
    addProductToPurchaseOrder: async (req: Request, res: Response) => {
      try {
        const { product } = req.body;
        const { id } = req.params;
        const order = await findPurchaseOrderById({
          purchaseOrderRepository: purchaseOrderService()
        }, {
          id
        })
        if (order instanceof NotFoundError) {
          return res.status(404).json({
            ok: false,
            message: "Pedido no encontrado"
          })
        }
        return await addProductToPurchaseItem({
          purchaseOrderRepository: purchaseOrderService(),
          productRepository: productService()
        }, {
          order,
          product
        })

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

