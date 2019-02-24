const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Product = require('./Product');

const CartSchema = Schema({
  cartProducts: [Product],
  total: Number,
  items: Number,
});

mongoose.model('Cart', CartSchema);
