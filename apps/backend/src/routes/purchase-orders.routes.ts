import {Router} from 'express';
import { purchaseOrderController } from 'src/controllers/order.controller';
const router = Router();
const {createNewPurchaseOrder, addProductToPurchaseOrder, findOrderById} = purchaseOrderController();
router
    .post('/', createNewPurchaseOrder)
    .get('/:id', findOrderById)
    .post('/:id/add-product', addProductToPurchaseOrder)
export default router