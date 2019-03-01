const mongoose = require('mongoose');
const authenticate = require('../middleware/auth');

const Product = mongoose.model('Product');


module.exports = (app) => {
  // Create new product
  app.post('/api/product', authenticate, (req, res) => {
    const { productName, productDescription, price } = req.body;
    const product = new Product({
      productName,
      productDescription,
      price,
    });

    product.save()
      .then(categories => res.send(categories))
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

  // Get all products
  app.get('/api/product', authenticate, (req, res) => {
    Product.find({})
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });

  // Get one product
  app.get('/api/product/:productId', authenticate, (req, res) => {
    Product.findById(req.params.productId)
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });
};
