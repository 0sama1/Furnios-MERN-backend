import mongoose from 'mongoose'
export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  avatar:string
  isBlocked: boolean
}
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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

    required: true,
  },
  avatar: {
    type: String,
  },
  isBlocked:{
    type: Boolean,
  },


  // relation between order and user should be many orders to one user
  // here's 1to1 just for the demo
  order: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Order',
  },
})

export default mongoose.model('User', userSchema)
