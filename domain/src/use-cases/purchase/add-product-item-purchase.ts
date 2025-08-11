import { Product } from "../../../src/entities/Product";
import { PurchaseOrder } from "../../../src/entities/PurchaseOrder";
import {
  createConflictError,
  createInvalidDataError,
  createNotFoundError,
  InvalidDataError,
} from "../../../src/errors/error";
import { ProductRepository } from "../../../src/repositories/product-repository";
import { PurchaseOrderRepository } from "../../../src/repositories/purchase-order-repository";

export interface AddProductPurchaseItemDependencies {
  purchaseOrderRepository: PurchaseOrderRepository;
  productRepository: ProductRepository;
}

export type AddProductPurchaseItemRequestModel = {
  order: PurchaseOrder;
  product: Product;
};

export async function addProductToPurchaseItem(
  {
    purchaseOrderRepository,
    productRepository,
  }: AddProductPurchaseItemDependencies,
  { order, product }: AddProductPurchaseItemRequestModel
): Promise<PurchaseOrder | InvalidDataError> {
  if (!product) throw createInvalidDataError("Product is missing");
  if (!order) throw createInvalidDataError("Purchase is missing");

  const existOrder = await purchaseOrderRepository.findOrderById(order.id);
  if (!existOrder) throw createInvalidDataError("Purchase order not found");

  const existProduct = await productRepository.findById(product.id);
  if (!existProduct) throw createNotFoundError("Product not found");

  const productInStock = await productRepository.verifyStock(product.id)
  if(!productInStock) throw createConflictError("Product out of stock")

  return purchaseOrderRepository.addProductInOrder(order, product);
}
