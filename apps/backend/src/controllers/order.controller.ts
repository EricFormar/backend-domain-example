import { AppError, createInternalServerError } from "@project-example/domain";
import { addProductToPurchaseItem } from "@domain/use-cases/purchase/add-product-item-purchase";
import { Request, Response } from "express";
import { purchaseOrderService } from "@backend/src/services/order.service";
import { productService } from "src/services/product.service";

export function purchaseOrderController() {
  return {
    addProductToPurchase: async (req: Request, res: Response) => {
      try {
        const {order,product} = req.body;
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
