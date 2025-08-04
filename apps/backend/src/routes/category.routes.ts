import {Router} from 'express';

import {categoryController} from '../controllers/category.controller';

const router = Router();
const {getAllCategories, getCategoryById, createNewCategory, updateCategory, deleteCategory} = categoryController();
router
    .get('/', getAllCategories)
    .get('/:id', getCategoryById)
    .post('', createNewCategory)
    .put('/:id', updateCategory)
    .delete('/:id', deleteCategory)
export default router

