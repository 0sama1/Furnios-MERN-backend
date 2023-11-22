import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'

// get all products
router.get('/', async (_, res) => {
  const products = await Product.find()
  // const categories = await Product.find().populate('products')
  console.log('products:', products)
  res.json(products)
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
router.put('/:productId', async (req, res, next) =>{
  const productId = req.params.productId
  const newName = req.body.name
  const newdescription = req.body.description
  const newimage = req.body.image
  const newprice = req.body.price
  const newquantity = req.body.quantity
  const newvariants = req.body.variants
  const newsizes = req.body.sizes
  const updatedProduct = await Product.updateOne({_id: productId}, {name: newName}, {description: newdescription})
  res.json({
    _id: productId,
    name: newName,
    description: newdescription,
  })
})

export default router
