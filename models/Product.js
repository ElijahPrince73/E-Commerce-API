const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Category = require('./Category');

const Image = require('./Image.js');

const ProductSchema = Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: String,
  quantity: Number,
  price: Number,
  categories: [Category],
  images: [Image],
});

mongoose.model('Product', ProductSchema);
