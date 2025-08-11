import { beforeEach, describe, expect, test } from "vitest";
import {
  createPurchaseOrderRepositoryMock,
  MockedPurchaseOrderRepository,
} from "../../mocks/purchase-order-repository-mock";
import { createPurchaseOrderMock } from "../../mocks/purchase-order-mock";
import { createProductMock } from "../../mocks/product-mock";
import { createPurchaseItemMock } from "../../mocks/purchase-item-mock.";
import {
  AddProductPurchaseItemDependencies,
  AddProductPurchaseItemRequestModel,
  addProductToPurchaseItem,
} from "./add-product-item-purchase";
import {
  createProductRepositoryMock,
  MockedProductRepository,
} from "../../mocks/product-repository-mock";

describe("Add item purchase order", async () => {
  const anyProduct = createProductMock({
    id: "any-id",
  });

  const otherProduct = createProductMock({
    id: "other-id",
  });

  const productOutOfStock = createProductMock({
    id: "out-of-stock-id",
    stock : 0
  });

  const purchaseItem = createPurchaseItemMock({
    id: "any-id",
    quantity: 1,
    product: anyProduct,
  });

  const _mockPurchaseOrderRepository: MockedPurchaseOrderRepository =
    createPurchaseOrderRepositoryMock([
      createPurchaseOrderMock({
        id: "any-id",
        items: [purchaseItem],
      }),
    ]);

  const _mockProductRepository: MockedProductRepository =
    createProductRepositoryMock([anyProduct, otherProduct, productOutOfStock]);

  let _dependencies: AddProductPurchaseItemDependencies;

  beforeEach(() => {
    _dependencies = {
      purchaseOrderRepository: _mockPurchaseOrderRepository,
      productRepository: _mockProductRepository,
    };
  });

  test("the quantity should be increased if the product is already an order item.", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: _mockPurchaseOrderRepository.orders[0],
      product: anyProduct,
    };

    const result = await addProductToPurchaseItem(_dependencies, itemPurchase);
    if ("items" in result) {
      expect(result.items).toHaveLength(1);
      expect(result.items?.[0]?.quantity).toBe(2);
    } else {
      throw new Error("Expected a PurchaseOrder, but received an error.");
    }
  });

  test("a product should be added to the order if all the data is correct.", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: _mockPurchaseOrderRepository.orders[0],
      product: otherProduct,
    };

    const result = await addProductToPurchaseItem(_dependencies, itemPurchase);
    if ("items" in result) {
      expect(result.items).toHaveLength(2);
      expect(result.items?.[1]?.quantity).toBe(1);
    } else {
      throw new Error("Expected a PurchaseOrder, but received an error.");
    }
  });

  test("should throw an InvalidDataError if a product is included", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: _mockPurchaseOrderRepository.orders[0],
      product: null as any,
    };
    await expect(
      addProductToPurchaseItem(_dependencies, itemPurchase)
    ).rejects.toThrow("Product is missing");
  });

  test("should throw a NotFoundError if the product is not found", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: _mockPurchaseOrderRepository.orders[0],
      product: createProductMock({
        id: "no-exist-id",
      }),
    };
    await expect(
      addProductToPurchaseItem(_dependencies, itemPurchase)
    ).rejects.toThrow("Product not found");
  });

  test("should throw an InvalidDataError if an order is not included", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: null as any,
      product: otherProduct,
    };
    await expect(
      addProductToPurchaseItem(_dependencies, itemPurchase)
    ).rejects.toThrow("Purchase is missing");
  });

  test("should throw a NotFoundError if the purchase order is not found", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: createPurchaseOrderMock({
        id: "other-id",
        items: [purchaseItem],
      }),
      product: anyProduct,
    };
    await expect(
      addProductToPurchaseItem(_dependencies, itemPurchase)
    ).rejects.toThrow("Purchase order not found");
  });

  test("should throw a ConflictError if the product is out of stock", async () => {
    const itemPurchase: AddProductPurchaseItemRequestModel = {
      order: createPurchaseOrderMock({
        id: "any-id",
        items: [purchaseItem],
      }),
      product: productOutOfStock,
    };
    await expect(
      addProductToPurchaseItem(_dependencies, itemPurchase)
    ).rejects.toThrow("Product out of stock");
  });

  //TODO: should decrease in the product's stock once added to the order
  //TODO: should recover the stock of the products if the order is cancelled or rejected
});
