import express from 'express'
const router = express.Router()


import Order from '../models/order'
import ApiError from '../errors/ApiError'
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/productsController'
import { checkAuth } from '../middlewares/checkAuth'
import { validateProduct } from '../middlewares/validateProduct'


// get all products

router.get('/', getAllProducts )

// get single product by id
router.get('/:productId', getProduct)

router.post('/product', validateProduct,  checkAuth('ADMIN'), createProduct)

// Delete a product by its ID
router.delete('/:productId', checkAuth('ADMIN'), deleteProduct)

// update a product by its ID
router.put('/:productId', checkAuth('ADMIN'), updateProduct)

export default router
