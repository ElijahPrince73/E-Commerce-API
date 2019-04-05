const mongoose = require('mongoose');
const authenticate = require('../../middleware/auth');

const Product = mongoose.model('Product');

module.exports = (app) => {
  // Get all products
  app.get('/api/products', authenticate, (req, res) => {
    Product.find({ userId: req.user._id })
      .then((products) => {
        res.send(products);
      })
      .catch(err => res.status(400).send(err));
  });

  // Get one product
  app.get('/api/product/:productId', authenticate, (req, res) => {
    Product.findById(req.params.productId)
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });
};
