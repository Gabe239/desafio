import mongoose from 'mongoose';

const collection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    id: {type: Number, required: false},
});

const productModel = mongoose.model(collection, productSchema);

export default productModel;