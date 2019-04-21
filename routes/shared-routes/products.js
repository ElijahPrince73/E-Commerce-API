const mongoose = require('mongoose');
const authHandler = require('../../middleware/middleware-handler');

const Product = mongoose.model('Product');

module.exports = (app) => {
  // Get all products
  app.get('/api/products', authHandler, (req, res) => {
    Product.find({ userId: req.user._id })
      .then((products) => {
        res.send(products);
      })
      .catch(err => res.status(400).send(err));
  });

  // Get one product
  app.get('/api/product/:productId', authHandler, (req, res) => {
    Product.findById(req.params.productId)
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });
};
