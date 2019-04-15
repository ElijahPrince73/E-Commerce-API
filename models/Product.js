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
  userId: String,
  sku: String,
  // priceTaxExcl: String,
  // priceTaxIncl: String,
  // taxRate: String,
  // width: String,
  // height: String,
  // depth: String,
  // weight: String,
  // shippingFee: String,
});

mongoose.model('Product', ProductSchema);
