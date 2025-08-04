import {Router} from 'express';

import {productController} from '../controllers/product.controller';

const router = Router();
const {getAllProducts, getProductById, createNewProduct, updateProduct, deleteProduct} = productController();
router
    .get('/', getAllProducts)
    .get('/:id', getProductById)
    .post('', createNewProduct)
    .put('/:id', updateProduct)
    .delete('/:id', deleteProduct)
export default router

