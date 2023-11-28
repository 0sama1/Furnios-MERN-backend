import { NextFunction, Request, Response } from "express"
import { Filter, SortOptions } from '../types/types'

import Product from '../models/product'
import ApiError from "../errors/ApiError"



export const getAllProducts = async (req: Request, res: Response) => {
  const page= Number(req.query.page) || 1
  const perPage = Number(req.query.perPage) || 3
  const category = req.query.category
  const name = req.query.name
  const price = req.query.price
  const sort = req.query.sort

  const filters: Filter ={}
  const sortOptions:SortOptions = {}

  if (category && typeof category === 'string'){
    filters.categories= category
  }
  if (name && typeof name === 'string'){
    filters.name = { $regex: new RegExp(name, 'i') };
  }
  // TODO: imporove this to accecpt any properties
  if (sort && typeof sort === 'string'){
    if(sort === 'asc'){
      sortOptions.sort ={name: 1}
    }
    if(sort === 'desc'){
      sortOptions.sort = {name: -1}
    }
  }

  const products = await Product.find(filters)
  .sort(sortOptions.sort)
  .skip((page - 1) * perPage)
  .limit(perPage)
  .populate('categories')

  const totalItems= await Product.countDocuments(filters)
  const totalPages = Math.ceil(totalItems / perPage)

  res.json({
    page,
    perPage,
    totalItems,
    totalPages,
    products
  })
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId
  const product = await Product.findById(productId)
  if(!product){
    next(ApiError.badRequest('Product not found!'))
  }
  res.json(product)
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
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
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId
  try {
    const product =await Product.deleteOne({
      _id: productId
    })
    if (!product) {
      next(ApiError.badRequest('Product not found'))
      return
    }
    res.json({
      product,
      msg: 'Produt deleted successfully',
    })
  } catch (error) {
    next(ApiError.internal('internal server error'))
    return
  }
}

export const updateProduct = async (req: Request, res: Response, next:NextFunction) => {
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
}