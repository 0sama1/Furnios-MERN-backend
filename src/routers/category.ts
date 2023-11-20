import express from 'express'
const router = express.Router()

import Category from '../models/category'
import ApiError from '../errors/ApiError'

router.get('/', async (_, res) => {
  const categories = await Category.find()
  console.log('categories:', categories)
  res.json(categories)
})

router.post('/', async (req, res, next) => {
  const { name} = req.body

  if (!name) {
    next(ApiError.badRequest('Name are requried'))
    return
  }
  const category = new Category({
    name,
  })

  await category.save()
  res.json(category)
})

export default router
