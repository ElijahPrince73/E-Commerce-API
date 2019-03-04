const mongoose = require('mongoose');
const multer = require('multer');
const authenticate = require('../../middleware/auth');
require('dotenv').config({ path: './.env.default' });
const createItem = require('../../utils/create-item');

// Used to read form-data sent from the client
const upload = multer();
const Product = mongoose.model('Product');

module.exports = (app) => {
  // Create new product
  app.post('/api/product', upload.any(), authenticate, (req, res) => {
    const productValues = JSON.parse(req.body.text);

    let {
      productName, productDescription, price, alt,
    } = productValues;

    const _id = req.user._id;

    createItem(req, res, productName, productDescription, price, alt, _id, 'product')
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });

  // Update product
  app.put('/api/product/:productId', authenticate, (req, res) => {
    const { productName, description } = req.body;
    Product.findByIdAndUpdate(
      { _id: req.params.productId },
      { $set: { productName, description } },
      { new: true },
    )
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });

  // Delete product
  app.delete('/api/product/:productId', authenticate, (req, res) => {
    Product.findByIdAndDelete(req.params.productId)
      .then(() => {
        res.status(200).send('product deleted');
      }).catch((err) => {
        res.status(500).send(err);
      });
  });
};
