const mongoose = require('mongoose');
const authenticate = require('../../middleware/auth');
require('dotenv').config({ path: './.env.default' });
const createItem = require('../../utils/create-item');

const Product = mongoose.model('Product');

module.exports = (app) => {
  // Create new product
  app.post('/api/product', authenticate, (req, res) => {
    let {
      productName, productDescription, price, alt, _id,
    } = req.body;

    const productValues = JSON.parse(req.fields.text);

    productName = productValues.productName;
    productDescription = productValues.productDescription;
    price = productValues.price;

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
