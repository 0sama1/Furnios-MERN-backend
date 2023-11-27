import { NextFunction, Request, Response } from 'express'
import { Role } from '../types/types'
import ApiError from '../errors/ApiError'

// INFO: this middleware is now merged with checkAuth.
// so no need to use it anymore
export function checkRole(expectedRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.decodedUser

    if (decodedUser.role !== expectedRole) {
      next(ApiError.forbidden('NOT ALLOWED'))
      return
    }
    next()
  }
}
