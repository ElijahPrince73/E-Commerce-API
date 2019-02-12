const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
});

mongoose.model('Product', ProductSchema);
