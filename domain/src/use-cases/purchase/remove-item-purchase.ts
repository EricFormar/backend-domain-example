import { Product } from "src/entities/Product";
import { PurchaseOrder } from "src/entities/PurchaseOrder";
import {
  createInvalidDataError,
  createNotFoundError,
  InvalidDataError,
} from "src/errors/error";
import { ProductRepository } from "src/repositories/product-repository";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";

export interface RemoveProductPurchaseItemDependencies {
  purchaseOrderRepository: PurchaseOrderRepository;
  productRepository: ProductRepository;
}

export type RemoveProductPurchaseItemRequestModel = {
  order: PurchaseOrder;
  product: Product;
};

export async function addProductToPurchaseItem(
  {
    purchaseOrderRepository,
    productRepository,
  }: RemoveProductPurchaseItemDependencies,
  { order, product }: RemoveProductPurchaseItemRequestModel
): Promise<PurchaseOrder | InvalidDataError> {
  if (!product) throw createInvalidDataError("Product is missing");
  if (!order) throw createInvalidDataError("Purchase order not found");

  const existOrder = await purchaseOrderRepository.findOrderById(order.id);
  if (!existOrder) throw createInvalidDataError("Purchase order not found");

  const existProduct = await productRepository.findById(product.id);
  if (!existProduct) throw createNotFoundError("Product not found");

  return purchaseOrderRepository.addProductInOrder(order, product);
}
