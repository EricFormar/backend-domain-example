import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { createProductMock } from "../../mocks/product-mock";
import { createPurchaseItemMock } from "../../mocks/purchase-item-mock.";
import { findPurchaseOrderById, FindPurchaseOrderByIdDependencies } from "./find-purchase-order-by-id";

describe("Find purchase order by id", async () => {
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

    let _dependencies: FindPurchaseOrderByIdDependencies;

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockPurchaseOrderRepository,
        }
    })

    test("should return the purchase order when it is found", async () => {
        const purchaseOrder = await findPurchaseOrderById(_dependencies, { id: "any-id" });
        expect(purchaseOrder).toEqual(_mockPurchaseOrderRepository.orders[0]);
     
    });


    test('should throw a NotFoundError when the purchase order is not found', async () => {
        await expect(findPurchaseOrderById(_dependencies, { id: "not-found" }))
            .rejects.toThrow("Purchase order not found");
    });
});