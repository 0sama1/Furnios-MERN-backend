import express from 'express'
const router = express.Router()


import Order from '../models/order'
import ApiError from '../errors/ApiError'
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controller/productsController'


// get all products

router.get('/', getAllProducts )

// get single product by id
router.get('/:productId', getProduct)

router.post('/', createProduct)

// Delete a product by its ID
router.delete('/:productId', deleteProduct)

// update a product by its ID
router.put('/:productId', updateProduct)

export default router
