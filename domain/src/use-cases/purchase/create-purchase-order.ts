import { UserRepository } from "../../../src/repositories/user-repository";
import { PurchaseOrder, PurchaseStatus } from "../../../src/entities/PurchaseOrder";
import { User } from "../../../src/entities/User";
import { createInvalidDataError, createNotFoundError, InvalidDataError } from "../../../src/errors/error";
import { PurchaseOrderRepository } from "../../../src/repositories/purchase-order-repository";

export interface PurchaseOrderCreateDependencies {
    purchaseOrderRepository: PurchaseOrderRepository;
    userRepository : UserRepository;
}

export interface PurchaseOrderRequestModel {
    total: number;
    date: Date;
    status: PurchaseStatus;
    buyer: Partial<User>;
}

const validPurchaseStatus: PurchaseStatus[] = [
    "pending", "approved", "in-progress", "received", "reject", "closed"
];

export async function purchaseOrderCreate(
    { purchaseOrderRepository, userRepository }: PurchaseOrderCreateDependencies,
    { total, date, status, buyer }: PurchaseOrderRequestModel
): Promise<PurchaseOrder | InvalidDataError> {
    if (total == null || total < 0) throw createInvalidDataError("El total debe ser igual o mayor a 0.");

    if (!date) throw createInvalidDataError("La fecha es requerida.");

    if (isNaN(new Date(date).getTime())) throw createInvalidDataError("La fecha no es válida.");

    if (!status) throw createInvalidDataError("El estado es requerido.");
    if (!validPurchaseStatus.includes(status)) throw createInvalidDataError("El estado tiene un valor incorrecto.");    

    if (!buyer) throw createInvalidDataError("El comprador es requerido.");
    const user = await userRepository.findById(buyer.id as string)
    if(!user) throw createNotFoundError("No existe o no se encuentra el comprador")

    return purchaseOrderRepository.createNewPurchaseOrder({
        total,
        date,
        status,
        buyer
    })
}