import mongoose from 'mongoose';

const collection = 'carts'

const cartSchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  });

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;