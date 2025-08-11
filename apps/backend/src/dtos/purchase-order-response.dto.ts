import { PurchaseStatus } from "@project-example/domain/entities/PurchaseOrder";
import { UserInPurchaseOrder } from "./user-in-purchase-order";
import { ProductInPurchaseOrder } from "./product-in-purchase-order";

export interface PurchaseOrderResponseDto {
  id: string;
  total: number;
  status: PurchaseStatus;
  date : Date;
  buyer : UserInPurchaseOrder;
  items : PurchaseItemResponseDto[]
}

export interface PurchaseItemResponseDto {
    id: string;
    quantity: number;
    product: ProductInPurchaseOrder;
}