const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Product = require('./Product');

const CategorySchema = Schema({
  _id: Schema.Types.ObjectId,
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: String,
  productList: [Product],
});

mongoose.model('Category', CategorySchema);
