const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports = (app) => {
  // Create new product
  app.post('/api/product', (req, res) => {
    const product = new Product({
      productName: req.body.productName,
      description: req.body.description,
    });

    product.save()
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });

  // Update product
  app.put('/api/product/:productId', (req, res) => {
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
  app.delete('/api/product/:productId', (req, res) => {
    Product.findByIdAndDelete(req.params.productId)
      .then(() => {
        res.status(200).send('product deleted');
      }).catch((err) => {
        res.status(500).send(err);
      });
  });

  // Get all products
  app.get('/api/product', (req, res) => {
    Product.find({})
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });

  // Get one product
  app.get('/api/product/:productId', (req, res) => {
    Product.findById(req.params.productId)
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });
};
