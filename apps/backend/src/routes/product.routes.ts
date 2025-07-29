import {Router} from 'express';

import {productController} from '../controllers/product.controller';

const router = Router();
const {getAllProducts, getProductById, createNewProduct, updateProduct, deleteProduct} = productController();
router
    .get('/', getAllProducts)
    .get('/:productId', getProductById)
    .post('', createNewProduct)
    .put('/:productId', updateProduct)
    .delete('/:productId', deleteProduct)
export default router

