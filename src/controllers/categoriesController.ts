import { NextFunction, Request, Response } from "express"
import { Filter, SortOptions } from "../types/types";

import Category from '../models/category'
import ApiError from "../errors/ApiError";


export const getAllCategories = async (req: Request, res: Response) => {
    try {
      const name = req.query.name;
      const sort = req.query.sort;
  
      const filters: Filter = {};
      const sortOptions: SortOptions = {};
  
      if (name && typeof name === 'string') {
        filters.name = { $regex: new RegExp(name, 'i') };
      }
  
      if (sort && typeof sort === 'string'){
        if(sort === 'asc'){
          sortOptions.sort ={name: 1}
        }
        if(sort === 'desc'){
          sortOptions.sort = {name: -1}
        }
      }
  
      const categories = await Category.find(filters).sort(sortOptions.sort);
      console.log('categories:', categories);
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoyId = req.params.categoyId
    const category = await Category.findById(categoyId)
    if (!category) {
      next(ApiError.badRequest('Category not found'))
      return
    }
    res.json(category)
  } catch (error) {
    next(ApiError.internal('Internal server error'))
  }
}

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body

  if (!name) {
    next(ApiError.badRequest('Name are requried'))
    return
  }
  const category = new Category({
    name,
  })

  await category.save()
  res.json(category)
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const categoyId = req.params.categoryId
  try {
    const category = await Category.findByIdAndDelete(categoyId)
    if (!category) {
      next(ApiError.badRequest('Category not found'))
      return
    }
    res.json({
      category,
      msg: 'Category deleted successfully',
    })
  } catch (error) {
    next(ApiError.internal('internal server error'))
    return
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  const newName = req.body.name
  const categoryId = req.params.categoryId
  const updatedCategory = await Category.updateOne({ _id: categoryId }, { name: newName })
  res.json({
    name: newName,
    _id: categoryId,
  })
}