import mongoose from 'mongoose'

export type CategoryDocument = Document & {
  name: string
}
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  }
)

export default mongoose.model<CategoryDocument>('category', categorySchema)
