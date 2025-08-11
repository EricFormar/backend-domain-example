import {Router} from 'express';
import { purchaseOrderController } from 'src/controllers/order.controller';
const router = Router();
const {createNewPurchaseOrder, addProductToPurchaseOrder} = purchaseOrderController();
router
    .post('/', createNewPurchaseOrder)
    .post('/:id/add-product', addProductToPurchaseOrder)
export default router