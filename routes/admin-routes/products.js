const mongoose = require('mongoose');
const multer = require('multer');
const authenticate = require('../../middleware/admin-user-auth');
require('dotenv').config({ path: './.env.default' });
const createItem = require('../../utils/create-item');

const Product = mongoose.model('Product');

// Used to read form-data sent from the client
const upload = multer();

module.exports = (app) => {
  // Create new product
  app.post('/api/products', upload.any(), authenticate, (req, res) => {
    const productValues = JSON.parse(req.body.text);

    let {
      productName, productDescription, price, alt, categories, sku,
    } = productValues;

    const userId = req.user._id;

    createItem(
      req,
      res,
      productName,
      productDescription,
      price,
      alt,
      userId,
      categories,
      sku,
      'product',
    )
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });

  // Update product
  app.put('/api/product/:productId', authenticate, (req, res) => {
    const { productName, description, categories } = req.body;
    Product.findByIdAndUpdate(
      { _id: req.params.productId },
      { $set: { productName, description, categories } },
      { new: true },
    )
      .then(product => res.send(product))
      .catch(err => res.status(400).send(err));
  });

  // Delete products
  app.post('/api/products-delete', authenticate, (req, res) => {
    const { ids } = req.body;

    Product.deleteMany({ _id: ids.map(id => id) })
      .then(() => {
        res.status(200).send('Products deleted');
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  // Delete image from product
  app.delete('/api/product-image/:productId', authenticate, (req, res) => {
    const imageId = req.body.imageId;
    Product.findById(req.params.productId)
      .then((product) => {
        // used to filter for product images we want to delete
        const updatedImageList = product.images.filter((image) => {
          const imageID = JSON.stringify(image._id);
          const deletedId = JSON.stringify(imageId);
          return imageID !== deletedId;
        });

        // reassign productList to product
        product.images = updatedImageList;

        return product.save();
      })
      .then((newProduct) => {
        res.send(newProduct);
      });
  });
};
