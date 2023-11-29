import express from 'express'
const router = express.Router()


import ApiError from '../errors/ApiError'
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categoriesController';
import { checkAuth } from '../middlewares/checkAuth';

router.get('/', getAllCategories);

router.get('/:categoyId', getSingleCategory)

router.post('/', checkAuth('ADMIN'), createCategory)

router.delete('/:categoryId', checkAuth('ADMIN'), deleteCategory)

router.put('/:categoryId', checkAuth('ADMIN'), updateCategory)
export default router
