declare namespace Express {
  interface Request {
    validatedUser: {
      email: string
      password: string
    }
    validatedProduct: {
      name: string
      price: number
      description: string
    }
    decodedUser: {
      userId: string
      email: string
      role: 'USER' | 'ADMIN'
      iat: number
      exp: number
    }
  }
}
