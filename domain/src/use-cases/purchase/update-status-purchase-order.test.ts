import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { PurchaseOrderCreateDependencies, PurchaseOrderRequestModel } from "./create-purchase-order";
import { createUserMock } from "../../mocks/user-mock";
import { updateStatusPurchaseOrder, UpdateStatusPurchaseOrderRequestModel } from "./update-status-purchase-order";

describe("Update status purchase order", async () => {
    const _mockUpdateStatusPurchaseOrderRepository: MockedPurchaseOrderRepository =
        createPurchaseOrderRepositoryMock([
            createPurchaseOrderMock({ id: "exist-id" })
        ]);

    let _dependencies: PurchaseOrderCreateDependencies

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockUpdateStatusPurchaseOrderRepository
        }
    })

    test("should create a new purchase order and return it", async () => {
        const purchaseData: UpdateStatusPurchaseOrderRequestModel = {
            order: { id: "exist-id" },
            status: "approved"
        };
        const result = await updateStatusPurchaseOrder(
            _dependencies,
            purchaseData
        );
        if ('status' in result) {
            expect(result.status).toBe("approved");
        } else {
            throw new Error('Expected a PurchaseOrder, but received an error.');
        }
    });

    test('debería lanzar un InvalidDataError si el total es cero o negativo', async () => {
        const purchaseData: UpdateStatusPurchaseOrderRequestModel = {
            order: { id: "unknown-id" },
            status: "approved"
        }
        await expect(updateStatusPurchaseOrder(_dependencies, purchaseData)).rejects.toThrow("No existe la orden de compra")
    });

    test('debería lanzar un InvalidDataError si el total es cero o negativo', async () => {
        const purchaseData: UpdateStatusPurchaseOrderRequestModel = {
            order: { id: "exist-id" },
            status: "unknown-status"
        } as any
        await expect(updateStatusPurchaseOrder(_dependencies, purchaseData)).rejects.toThrow("El estado es incorrecto")
    });

});