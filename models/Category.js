const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Product = require('./Product');

const CategorySchema = Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: String,
  productList: [Product],
  image: String,
  userId: String,
});

mongoose.model('Category', CategorySchema);
