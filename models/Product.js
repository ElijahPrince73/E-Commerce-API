const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Category = require('./Category');

const ProductSchema = Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: String,
  quantity: Number,
  price: Number,
  categories: [Category],
});

mongoose.model('Product', ProductSchema);
