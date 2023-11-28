import zod, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const schema = zod.object({
    name: zod.string(),
    price: zod.number().min(1),
    description: zod.string(),
  })

  try {
    const validatedProduct = schema.parse(req.body)
    req.validatedProduct = validatedProduct
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }

    next(ApiError.internal('Something went wrong'))
  }
}
