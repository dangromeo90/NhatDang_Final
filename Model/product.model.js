const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  thumbnail: { type: String, required: false },
  description: { type: String, required: false },
  stock: { type: Number, required: true },
  reviews: { type: Array, required: false, default: [] },
  images: { type: Array, required: false, default: [] },
  size: { type: Array, required: false, default: [] },
  count_sold: { type: Number, required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
  brand: { type: String, required: false },
  rating: { type: Number, required: false, default: 0 },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  update_by: { type: String, required: false },
  update_at: { type: Date, default: Date.now },
  view: { type: Number, required: false, default: 0 },
  status: { type: Number, required: false, default: 1 }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
