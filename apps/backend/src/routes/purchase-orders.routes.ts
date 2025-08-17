import {Router} from 'express';
import { purchaseOrderController } from 'src/controllers/order.controller';
const router = Router();
const {createNewPurchaseOrder, addProductToPurchaseOrder, findOrderById, removeItemToPurchaseOrder} = purchaseOrderController();
router
    .post('/', createNewPurchaseOrder)
    .get('/:idOrder', findOrderById)
    .post('/:idOrder/products/:idProduct', addProductToPurchaseOrder)
    .delete('/:idOrder/items/:idItem', removeItemToPurchaseOrder)
export default router