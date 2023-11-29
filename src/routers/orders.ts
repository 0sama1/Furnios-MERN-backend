import express, { response } from 'express'
import { Request, Response } from 'express'
const router = express.Router()

import User from '../models/user'
import ApiError from '../errors/ApiError'
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
} from '../controllers/ordersController'
import { checkAuth } from '../middlewares/checkAuth'

// CREATE: POST request to create a new order
router.post('/', checkAuth('ADMIN'), createOrder)

// READ: GET request to fetch all orders
router.get('/', checkAuth('ADMIN'), getAllOrders)

//Get By ID
router.get('/:orderId', getSingleOrder)

router.delete('/:orderId', checkAuth('ADMIN'), deleteOrder)

router.put('/:orderId', checkAuth('ADMIN'), updateOrder)

export default router
