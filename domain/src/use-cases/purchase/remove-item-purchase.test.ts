import { beforeEach, describe, expect, test } from "vitest";
import { createPurchaseOrderRepositoryMock, MockedPurchaseOrderRepository } from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { createProductMock } from "../../mocks/product-mock";
import { createPurchaseItemMock } from "../../mocks/purchase-item-mock.";
import { RemoveProductPurchaseItemDependencies, RemoveProductPurchaseItemRequestModel, removeProductToPurchaseItem } from "./remove-item-purchase";
import { PurchaseOrder } from "../../entities/PurchaseOrder";

describe("Add item purchase order", async () => {
    const _mockPurchaseOrderRepository: MockedPurchaseOrderRepository =
        createPurchaseOrderRepositoryMock([
            createPurchaseOrderMock({
                id: "order-id", items: [
                    createPurchaseItemMock({
                        id: "any-item-id",
                        quantity: 1,
                        product: createProductMock({
                            id: "any-product-id"
                        })
                    }),
                      createPurchaseItemMock({
                        id: "other-item-id",
                        quantity: 1,
                        product: createProductMock({
                            id: "any-product-id"
                        })
                    })
                ]
            })
        ]);

    let _dependencies: RemoveProductPurchaseItemDependencies;

    beforeEach(() => {
        _dependencies = {
            purchaseOrderRepository: _mockPurchaseOrderRepository,
        }
    })

    test("should create a new purchase order and return it", async () => {
        const itemPurchaseRequestModel: RemoveProductPurchaseItemRequestModel = {
           order : _mockPurchaseOrderRepository.orders[0],
           idItem : "other-item-id"
        };

        const response = await removeProductToPurchaseItem(
            _dependencies,
            itemPurchaseRequestModel
        );

        expect((response as PurchaseOrder).items).toHaveLength(1)        
    });

     test("should create a new purchase order and return it", async () => {
        const itemPurchaseRequestModel: RemoveProductPurchaseItemRequestModel = {
           order : _mockPurchaseOrderRepository.orders[0],
           idItem : "unknown-item-id"
        };
        await expect(removeProductToPurchaseItem(
            _dependencies,
            itemPurchaseRequestModel
        )).rejects.toThrow("Purchase item not found")
    });

       test("should create a new purchase order and return it", async () => {
        const itemPurchaseRequestModel: RemoveProductPurchaseItemRequestModel = {
           order : _mockPurchaseOrderRepository.orders[1],
           idItem : "any-item-id"
        };
        await expect(removeProductToPurchaseItem(
            _dependencies,
            itemPurchaseRequestModel
        )).rejects.toThrow("Purchase order is missing")
    });

       test("should create a new purchase order and return it", async () => {
        const itemPurchaseRequestModel: RemoveProductPurchaseItemRequestModel = {
           order :  
            createPurchaseOrderMock({
                id: "unknow-id", items: []
            }),
           idItem : "any-item-id"
        };
        await expect(removeProductToPurchaseItem(
            _dependencies,
            itemPurchaseRequestModel
        )).rejects.toThrow("Purchase order not found")
    });
});