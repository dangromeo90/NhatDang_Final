const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_by: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  update_by: { type: String, required: false },
  update_at: { type: Date, default: Date.now },
  status: { type: Number, required: false, default: 1 }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
