import express from 'express'
const router = express.Router()

import Category from '../models/category'
import ApiError from '../errors/ApiError'

router.get('/', async (_, res) => {
  const categories = await Category.find()
  console.log('categories:', categories)
  res.json(categories)
})
router.get('/:categoyId', async (req, res) => {
  const categoyId = req.params.categoyId
  const categories = await Category.findById(categoyId)
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

router.delete('/:categoryId', async (req, res) =>{
  const categoyId = req.params.categoryId
  const category = await Category.deleteOne({
    _id: categoyId,
  })
  res.json({
    _id: categoyId,
    name: req.body.name,
    msg: "Category deleted"

  })
})

router.put('/:categoryId', async (req, res) =>{
  const newName = req.body.name
  const categoryId= req.params.categoryId
  const updatedCategory = await Category.updateOne({_id: categoryId}, {name: newName})
  res.json({
    name: newName,
    _id: categoryId
  })
})
export default router
