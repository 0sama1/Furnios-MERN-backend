import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'

// get all products

router.get('/', async (req, res) => {
  const page= Number(req.query.page) || 1
  const perPage = Number(req.query.perPage) || 3
  const products = await Product.find().skip((page - 1) * perPage).limit(perPage).populate('categories')
  const totalItems= await Product.countDocuments()
  const totalPages = Math.ceil(totalItems / perPage)
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
router.put('/:productId', async (req, res, next) => {
  const productId = req.params.productId;
  const { name, description, image, price, quantity, categories, variants, sizes} = req.body;
  try {
    if (!name || !description || !price) {
      next(ApiError.badRequest('Name, Description, and Price are required.'));
      return;
    }

    const updateResult = await Product.updateOne({
      _id: productId
    }, {
      $set: {
        name,
        description,
        image,
        categories,
        price,
        quantity,
        variants,
        sizes
      }
    });

    if (updateResult.modifiedCount > 0) {
      res.json({
        _id: productId,
        name,
        description,
        image,
        categories,
        price,
        quantity,
        variants,
        sizes
      });
    } else {
      next(ApiError.badRequest('No changes were made'))
      return
    }
  } catch (error) {
    next(ApiError.badRequest('Product not found'))
    return
  }
});

export default router
