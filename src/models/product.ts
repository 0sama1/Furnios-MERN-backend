import mongoose from 'mongoose'

export type ProductDocument = Document & {
  name: string
  image: string
  description: string
  categories: string
  variants: string
  sizes: string
  price: number
  quantity: number
}
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
  },
  variants: {
    type: [{ type: String }],
  },
  sizes: {
    type: [{ type: String }],
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)