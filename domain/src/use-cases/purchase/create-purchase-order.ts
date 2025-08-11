import { PurchaseOrder, PurchaseStatus } from "src/entities/PurchaseOrder";
import { createInvalidDataError, InvalidDataError } from "src/errors/error";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";

export interface PurchaseOrderCreateDependencies {
    purchaseOrderRepository: PurchaseOrderRepository;
}

export type PurchaseOrderRequestModel = Omit<PurchaseOrder, "id">;

const validPurchaseStatus: PurchaseStatus[] = [
    "pending", "approved", "in-progress", "received", "reject", "closed"
];

export async function purchaseOrderCreate(
    { purchaseOrderRepository }: PurchaseOrderCreateDependencies,
    { total, date, status, buyer }: PurchaseOrderRequestModel
): Promise<PurchaseOrder | InvalidDataError> {
    if (total == null || total <= 0) {
        throw createInvalidDataError("El total debe ser un número positivo.");
    }

    if (!date) {
        throw createInvalidDataError("La fecha es requerida.");
    }

    if (isNaN(new Date(date).getTime())) {
        throw createInvalidDataError("La fecha no es válida.");
    }

    if (!status || !validPurchaseStatus.includes(status)) {
        throw createInvalidDataError("El estado es requerido.");
    }

    if (!buyer) {
        throw createInvalidDataError("El comprador es requerido.");
    }

    return purchaseOrderRepository.createNewPurchaseOrder({
        total,
        date,
        status,
        buyer
    })
}