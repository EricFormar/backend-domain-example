import {Router} from 'express';
import {brandController} from '../controllers/brand.controller';

const router = Router();
const {getAllBrands, getBrandById, createNewBrand, updateBrand, deleteBrand} = brandController();
router
    .get('/', getAllBrands)
    .get('/:brandId', getBrandById)
    .post('/', createNewBrand)
    .put('/:brandId', updateBrand)
    .delete('/:brandId', deleteBrand)
export default router