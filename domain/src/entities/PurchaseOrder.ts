import { PurchaseItem } from "./PurchaseItem";
import { User } from "./User";

export interface PurchaseOrder {
  id: string;
  total: number;
  date : Date;
  status: PurchaseStatus;
  buyer : User;
  items? : PurchaseItem[]
}

export type PurchaseStatus =  "pending" | "approved" | "in-progress" | "received" | "reject" | "closed"