import {Router} from 'express';
import {brandController} from '../controllers/brand.controller';

const router = Router();
const {getAllBrands, getBrandById, createNewBrand, updateBrand, deleteBrand} = brandController();
router
    .get('/', getAllBrands)
    .get('/:id', getBrandById)
    .post('/', createNewBrand)
    .put('/:id', updateBrand)
    .delete('/:id', deleteBrand)
export default router