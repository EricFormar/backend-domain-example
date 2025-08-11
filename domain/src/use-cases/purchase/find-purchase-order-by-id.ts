import { PurchaseOrder } from "../../../src/entities/PurchaseOrder";
import {
  createNotFoundError,
  NotFoundError,
} from "../../../src/errors/error";
import { PurchaseOrderRepository } from "../../../src/repositories/purchase-order-repository";

export interface FindPurchaseOrderByIdDependencies {
  purchaseOrderRepository: PurchaseOrderRepository;
}

export type FindPurchaseOrderByIdRequestModel = {
  id: string;
};

export async function findPurchaseOrderById(
  {
    purchaseOrderRepository,
  }: FindPurchaseOrderByIdDependencies,
  { id }: FindPurchaseOrderByIdRequestModel
): Promise<PurchaseOrder | NotFoundError> {

  const order = await purchaseOrderRepository.findOrderById(id);
  if (!order) throw createNotFoundError("Purchase order not found");

  return order;
}
