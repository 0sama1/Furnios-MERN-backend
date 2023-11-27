export type DecodedUser = {
  // firstName: string
  // lastName: string
  userId: string
  email: string
  role: Role
  iat: number
  exp: number
}

export type Role = 'USER' | 'ADMIN'
