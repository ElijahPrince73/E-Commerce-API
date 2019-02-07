const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = Schema({
  categoryName: {
    type: String,
    required: true,
  },
  description: String,
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
});


mongoose.model('Category', CategorySchema);
