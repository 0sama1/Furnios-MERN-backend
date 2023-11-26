import express, { response } from 'express'
import { Request, Response } from 'express'
const router = express.Router()

import Order, { OrderDocument } from '../models/order'
import User from '../models/user'
import ApiError from '../errors/ApiError'

// CREATE: POST request to create a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, userId, purchasedAt } = req.body

    // Validate required fields
    if (!productId || !userId || !purchasedAt) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Create a new order
    const newOrder: OrderDocument = new Order({
      productId,
      userId,
      purchasedAt,
    })

    // Save the order to the database
    const savedOrder: OrderDocument = await newOrder.save()

    res.status(201).json(savedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

// READ: GET request to fetch all orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders: OrderDocument[] = await Order.find()
    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

//Get By ID
router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ error: 'Id Order cannot be found! try again.' })
    }
    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error! Its us not you.' })
  }
})

// Here goes Post
router.post('/', async (req, res, next) => {
  try {
    const { name, products } = req.body

    const order = new Order({
      name,
      products,
    })

    await order.save()
    console.log('orderId:', order._id)

    const user = new User({
      name: 'Walter',
      order: order._id,
    })

    await user.save()
    res.json(order)
  } catch (error) {
    // Handle errors
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
function async(
  req: any,
  res: any
): import('express-serve-static-core').RequestHandler<
  { orderID: string },
  any,
  any,
  import('qs').ParsedQs,
  Record<string, any>
> {
  throw new Error('Function not implemented.')
}
