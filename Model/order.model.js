const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    created_by: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });
  

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
