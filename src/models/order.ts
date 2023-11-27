import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema({
  productId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  purchasedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
