import { NextFunction, Request, Response } from 'express'

import Order from '../models/order'
import User from '../models/user'
import Product from '../models/product'

import ApiError from '../errors/ApiError'

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productsId, userId, purchasedAt } = req.body

    // Validate required fields
    if (!productsId || !userId) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Create a new order
    const newOrder = new Order({
      productsId,
      userId,
      purchasedAt,
    })

    const user= await User.findByIdAndUpdate(userId, { $push: { order: newOrder } },{new: true}).exec()
    const product = await Product.findById(productsId)

    // Save the order to the database
    if(!user || !product){
      next(ApiError.badRequest('User not found or a product'))
      return
    }
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('productsId').populate('userId')
    res.status(200).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId).populate('productsId').populate('userId')
    if (!order) {
      return res.status(404).json({ error: 'Id Order cannot be found! try again.' })
    }
    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error! Its us not you.' })
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const deletedOrder = await Order.findByIdAndDelete(orderId)
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Id Order cannot be found! try again.' })
    }
    res.json(deletedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error! Its us not you.' })
  }
}
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, { new: true })
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Id Order cannot be found! try again.' })
    }
    res.json(updatedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error! Its us not you.' })
  }
}
