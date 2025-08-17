import { PurchaseOrder } from "../../entities/PurchaseOrder";
import {
  createInvalidDataError,
  createNotFoundError,
  InvalidDataError,
} from "../../errors/error";
import { PurchaseOrderRepository } from "../../repositories/purchase-order-repository";

export interface RemoveProductPurchaseItemDependencies {
  purchaseOrderRepository: PurchaseOrderRepository;
}

export type RemoveProductPurchaseItemRequestModel = {
  order: Pick<PurchaseOrder, "id">;
  idItem: string;
};

export async function removeProductToPurchaseItem(
  {
    purchaseOrderRepository,
  }: RemoveProductPurchaseItemDependencies,
  { order, idItem }: RemoveProductPurchaseItemRequestModel
): Promise<PurchaseOrder | InvalidDataError> {
  if (!idItem) throw createInvalidDataError("Item order ID is missing");
  if (!order) throw createInvalidDataError("Purchase order is missing");

  const existPurchsaeOrder = await purchaseOrderRepository.findOrderById(order.id);
  if (!existPurchsaeOrder) throw createInvalidDataError("Purchase order not found");

  const existPurchaseItem = await purchaseOrderRepository.findItemInOrder(idItem, order.id);
  if (!existPurchaseItem) throw createNotFoundError("Purchase item not found");

  return purchaseOrderRepository.removeItemFromOrder(order, idItem);
}
