import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'

router.get('/', async (_, res) => {
  const products = await Product.find()
  // const categories = await Product.find().populate('products')
  console.log('products:', products)
  res.json(products)
})

router.post('/', async (req, res, next) => {
  const { name, image, description, categories, variants, sizes, price, quantity } = req.body

  if (!name || !description || !price) {
    next(ApiError.badRequest('Name, Description and Price are requried'))
    return
  }
  const product = new Product({
    name,
    image,
    description, 
    categories, 
    variants, 
    sizes, 
    price, 
    quantity
  })

  await product.save()
  res.json(product)
})

export default router
