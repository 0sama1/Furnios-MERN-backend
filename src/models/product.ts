import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
      required: true,
    },
    image:{
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    categories:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'category',
      required: true,
    },
    variants:{
        type: [{type: String}],
    },
    sizes:{
      type: [{type: String}],
    },
    price:{
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }
)

export default mongoose.model('Product', productSchema)
