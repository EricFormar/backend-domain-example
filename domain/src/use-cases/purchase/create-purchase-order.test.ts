import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { purchaseOrderCreate, PurchaseOrderCreateDependencies, PurchaseOrderRequestModel } from "./create-purchase-order";
import { createUserMock } from "../../mocks/user-mock";

describe("Create purchase order", async () => {
    const _mockPurchaseOrderRepository: MockedPurchaseOrderRepository =
        createPurchaseOrderRepositoryMock([
            createPurchaseOrderMock({ id: "any-id" })
        ]);

    let _dependencies: PurchaseOrderCreateDependencies

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockPurchaseOrderRepository
        }
    })

    test("should create a new purchase order and return it", async () => {
        const purchaseData: PurchaseOrderRequestModel = {
            total: 100,
            date: new Date(),
            status: "pending",
            buyer: createUserMock({
                id: "buyer-id",
                email: "buyer-email"
            })
        };
        const result = await purchaseOrderCreate(
            _dependencies,
            purchaseData
        );
        expect(result).toEqual({
            id: "new-id",
            ...purchaseData
        })
    });

    test('debería lanzar un InvalidDataError si el total es cero o negativo', async () => {
        const invalidDataTotal: PurchaseOrderRequestModel = {
            total: 0,
            date: new Date(),
            status: "pending",
            buyer: createUserMock({
                email: "new-buyer"
            })
        };
        await expect(purchaseOrderCreate(_dependencies, invalidDataTotal)).rejects.toThrow("El total debe ser un número positivo.")
    });

    test('debería lanzar un InvalidDataError si la fecha no es válida', async () => {
        const invalidDataDate = {
            total: 150,
            date: "invalid-date",
            status: 'enviado',
            buyer: 'María García'
        } as any;
        await expect(purchaseOrderCreate(_dependencies, invalidDataDate))
            .rejects.toThrow("La fecha no es válida.");
    });

    test('debería lanzar un InvalidDataError si el estado es una cadena vacía', async () => {
        const invalidDataStatus = {
            total: 150,
            date: new Date('2025-08-07'),
            status: "other-status",
            buyer: createUserMock({name : "new-buyer"})
        } as any;
        await expect(purchaseOrderCreate(_dependencies, invalidDataStatus))
            .rejects.toThrow("El estado es requerido.");
    });

    test('debería lanzar un InvalidDataError si el comprador es nulo', async () => {
        const invalidDataBuyer = {
            total: 150,
            date: new Date('2025-08-07'),
            status: 'pending',
            buyer: null
        } as any;
        await expect(purchaseOrderCreate(_dependencies, invalidDataBuyer))
            .rejects.toThrow("El comprador es requerido.");
    });
});