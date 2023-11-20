import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
  productId: number
  userId: number
  purchasedAt: Date
}

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },

  productId: {
    type: Number,
    required: true,
  },

  userId: {
    type: Number,
    required: true,
  },

  purchasedAt: {
    type: Date,
    required: true,
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
