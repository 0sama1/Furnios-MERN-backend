export type DecodedUser = {
  userId: string
  email: string
  role: Role
  iat: number
  exp: number
}

export type Role = 'USER' | 'ADMIN'

export type Filter ={
  categories?: string,
  name?:{ $regex: RegExp },
}
export type SortOptions = {sort?:'asc' | 'desc' |{name: number}}
