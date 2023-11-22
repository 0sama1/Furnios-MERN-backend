import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'

// get all products

  console.log('products:', products)
  res.json({
    totalItems,
    totalPages,
    perPage,
    page,
    products
  })
})
// get single product by id
router.get('/:productId', async (req, res, next) => {
  const productId = req.params.productId
  const product = await Product.findById(productId).populate('categories')
  if(!product){
    next(ApiError.badRequest('Product not found!'))
  }
  res.json(product)
})
// get single product by id
router.get('/:productId', async (req, res, next) => {
  const productId = req.params.productId
  const product = await Product.findById(productId)
  if(!product){
    next(ApiError.badRequest('Product not found!'))
  }
  res.json(product)
})

router.post('/', async (req, res, next) => {
  const { name, image, description, categories, variants, sizes, price, quantity } = req.body

  if (!name || !description || !price) {
    next(ApiError.badRequest('Name, Description and Price are requried .'))
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
// Delete a product by its ID
router.delete('/:productId', async (req, res, next) => {
  const productId = req.params.productId
  const product =await Product.deleteOne({
    _id: productId
  })
  res.json({
    _id: productId,
    name: req.body.name
  })

})
// update a product by its ID

export default router
