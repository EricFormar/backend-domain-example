import { PurchaseOrder, PurchaseStatus } from "src/entities/PurchaseOrder";
import { createInvalidDataError, InvalidDataError } from "src/errors/error";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";

export interface UpdateStatusPurchaseOrderDependencies {
    purchaseOrderRepository: PurchaseOrderRepository;
}

export type UpdateStatusPurchaseOrderRequestModel = {
    order : Pick<PurchaseOrder, "id">,
    status : PurchaseStatus
};

const validPurchaseStatus: PurchaseStatus[] = [
    "pending", "approved", "in-progress", "received", "reject", "closed"
];

export async function updateStatusPurchaseOrder(
    { purchaseOrderRepository }: UpdateStatusPurchaseOrderDependencies,
    { order, status }: UpdateStatusPurchaseOrderRequestModel
): Promise<PurchaseOrder | InvalidDataError> {

    const existOrder = await purchaseOrderRepository.findOrderById(order.id)

    if (!existOrder) {
        throw createInvalidDataError("No existe la orden de compra");
    }

    if (!status || !validPurchaseStatus.includes(status)) {
        throw createInvalidDataError("El estado es incorrecto");
    }

    return purchaseOrderRepository.updateStatus(order, status)
}