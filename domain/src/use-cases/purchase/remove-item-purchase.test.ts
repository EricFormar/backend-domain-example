import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { purchaseOrderCreate, PurchaseOrderRequestModel } from "./create-purchase-order";
import { createUserMock } from "../../mocks/user-mock";
import { createProductMock } from "../../mocks/product-mock";
import { createPurchaseItemMock } from "../../mocks/purchase-item-mock.";
import { createProductRepositoryMock, MockedProductRepository } from "../../mocks/product-repository-mock";
import { RemoveProductPurchaseItemDependencies, RemoveProductPurchaseItemRequestModel } from "./remove-item-purchase";

describe("Add item purchase order", async () => {
    const _mockPurchaseOrderRepository: MockedPurchaseOrderRepository =
        createPurchaseOrderRepositoryMock([
            createPurchaseOrderMock({
                id: "any-id", items: [
                    createPurchaseItemMock({
                        id: "any-id",
                        quantity: 1,
                        product: createProductMock({
                            id: "any-id"
                        })
                    })
                ]
            })
        ]);

    const _mockProductRepository: MockedProductRepository =
        createProductRepositoryMock([
            createProductMock({
                id: "other-id"
            })
        ]);

    let _dependencies: RemoveProductPurchaseItemDependencies;

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockPurchaseOrderRepository,
            productRepository: _mockProductRepository
        }
    })

    test("should create a new purchase order and return it", async () => {
        const itemPurchase: RemoveProductPurchaseItemRequestModel = {
           order : _mockPurchaseOrderRepository.orders[0],
           product : createProductMock({
                id : "other-id"
           })
        };
     
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
            buyer: createUserMock({ name: "new-buyer" })
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