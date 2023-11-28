import { NextFunction, Request, Response } from "express"

import Order from '../models/order'


export const createOrder = async (req: Request, res: Response) => {
    try {
      const { productId, userId, purchasedAt } = req.body
  
      // Validate required fields
      if (!productId || !userId) {
        return res.status(400).json({ message: 'All fields are required' })
      }
  
      // Create a new order
      const newOrder = new Order({
        productId,
        userId,
        purchasedAt,
      })
  
      // Save the order to the database
      const savedOrder = await newOrder.save()
  
      res.status(201).json(savedOrder)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  export const getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await Order.find().populate('productId').populate('userId')
      res.status(200).json(orders)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  export const getSingleOrder = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.orderId
      const order = await Order.findById(orderId).populate('productId').populate('userId')
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