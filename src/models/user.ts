import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  avatar: string
  isBlocked: boolean
  isActive: boolean
  activationToken: string | undefined
}

function validateRole(role: string) {
  if (role === 'USER' || role === 'ADMIN') {
    return true
  }
  return false
}
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'USER',
    validate: [validateRole, 'Role has to be either USER or ADMIN'],
  },
  avatar: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
  },
  order: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Order',
  },
})

export default mongoose.model<UserDocument>('User', userSchema)
