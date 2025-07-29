import {Router} from 'express';

import {categoryController} from '../controllers/category.controller';

const router = Router();
const {getAllCategories, getCategoryById, createNewCategory, updateCategory, deleteCategory} = categoryController();
router
    .get('/', getAllCategories)
    .get('/:categoryId', getCategoryById)
    .post('', createNewCategory)
    .put('/:categoryId', updateCategory)
    .delete('/:categoryId', deleteCategory)
export default router

