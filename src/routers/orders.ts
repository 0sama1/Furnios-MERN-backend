import express, { response } from 'express'
import { Request, Response } from 'express'
const router = express.Router()

import User from '../models/user'
import ApiError from '../errors/ApiError'
import { createOrder, deleteOrder, getAllOrders, getSingleOrder } from '../controller/ordersController'

// CREATE: POST request to create a new order
router.post('/', createOrder)

// READ: GET request to fetch all orders
router.get('/', getAllOrders)

//Get By ID
router.get('/:orderId', getSingleOrder)

router.delete('/:orderId', deleteOrder)

export default router
