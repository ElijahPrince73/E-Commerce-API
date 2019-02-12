const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = Schema({
  productName: {
    type: String,
    required: true,
  },
  description: String,
});

mongoose.model('Product', ProductSchema);
