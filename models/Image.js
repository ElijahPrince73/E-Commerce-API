const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  alt: String,
});

mongoose.model('Image', ImageSchema);
