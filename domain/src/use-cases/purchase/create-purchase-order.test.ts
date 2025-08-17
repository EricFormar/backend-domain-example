import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { purchaseOrderCreate, PurchaseOrderCreateDependencies, PurchaseOrderRequestModel } from "./create-purchase-order";
import { createUserMock } from "../../mocks/user-mock";
import { createUserRepositoryMock, MockedUserRepository } from "../../mocks/user-repository-mock";

describe("Create purchase order", async () => {
    const _mockPurchaseOrderRepository: MockedPurchaseOrderRepository =
        createPurchaseOrderRepositoryMock([
            createPurchaseOrderMock({ id: "any-id" })
        ]);
    const _mockUserRepository : MockedUserRepository = 
        createUserRepositoryMock([
            createUserMock({id: "buyer-id", email : "buyer-email"})
        ])

    let _dependencies: PurchaseOrderCreateDependencies

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockPurchaseOrderRepository,
            userRepository : _mockUserRepository
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

    test('should throw an InvalidDataError if the total is zero or negative', async () => {
        const invalidDataTotal: PurchaseOrderRequestModel = {
            total: -10,
            date: new Date(),
            status: "pending",
            buyer: createUserMock({
                id : "buyer-id",
                email: "buyer-email"
            })
        };
        await expect(purchaseOrderCreate(_dependencies, invalidDataTotal)).rejects.toThrow("El total debe ser igual o mayor a 0.")
    });

    test('should throw an InvalidDataError if the date is not valid', async () => {
        const invalidDataDate = {
            total: 150,
            date: "invalid-date",
            status: 'valid-status',
            buyer: 'María García'
        } as any;
        await expect(purchaseOrderCreate(_dependencies, invalidDataDate))
            .rejects.toThrow("La fecha no es válida.");
    });

    test('should throw an InvalidDataError if the status is invalid', async () => {
        const invalidDataStatus = {
            total: 150,
            date: new Date('2025-08-07'),
            status: "other-status",
            buyer: createUserMock({name : "new-buyer"})
        } as any;
        await expect(purchaseOrderCreate(_dependencies, invalidDataStatus))
            .rejects.toThrow("El estado tiene un valor incorrecto.");
    });

    test('should throw an InvalidDataError if the buyer is null', async () => {
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