import { Product } from "src/entities/Product";
import { PurchaseOrder } from "src/entities/PurchaseOrder";
import { createInvalidDataError, createNotFoundError, InvalidDataError } from "src/errors/error";
import { ProductRepository } from "src/repositories/product-repository";
import { PurchaseOrderRepository } from "src/repositories/purchase-order-repository";

export interface AddProductPurchaseItemDependencies {
    purchaseOrderRepository: PurchaseOrderRepository;
    productRepository : ProductRepository;
}

export type AddProductPurchaseItemRequestModel = {
    order : PurchaseOrder,
    product : Product
};


export async function addProductToPurchaseItem(
    { purchaseOrderRepository , productRepository}: AddProductPurchaseItemDependencies,
    { order, product }: AddProductPurchaseItemRequestModel
): Promise<PurchaseOrder | InvalidDataError> {

    const existOrder = await purchaseOrderRepository.findOrderById(order.id)
    if (!existOrder) {
        throw createInvalidDataError("No existe la orden de compra");
    }

    if (!product) {
        throw createInvalidDataError("Product is missing");
    }

    const existProduct = await productRepository.findById(product.id)
    if(!existProduct) throw createNotFoundError("Product not found")


    return purchaseOrderRepository.addProductInOrder(order, product)
}