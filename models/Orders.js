const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;
const Product = require('./Product');

const OrdersSchema = Schema({
  userId: String,
  productList: [Product],
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  address: { type: String, required: true },
  address2: String,
  zip: { type: Number, required: true, maxLength: 5 },
  totalAmount: Number,
  orderNumber: {
    type: Number,
    default: Math.floor(Math.random() * (10000000000000 - 5 + 1)) + 5,
  },
  items: Number,
});

mongoose.model('Order', OrdersSchema);
