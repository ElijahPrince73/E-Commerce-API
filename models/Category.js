const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = Schema({
  _id: Schema.Types.ObjectId,
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: String,
  productList: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
  }],
});


mongoose.model('Category', CategorySchema);
