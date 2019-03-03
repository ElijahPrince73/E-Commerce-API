const mongoose = require('mongoose');
const authenticate = require('../../middleware/auth');
require('dotenv').config({ path: './.env.default' });
const postImageToBucket = require('../../utils/postImageToBucket');

const Product = mongoose.model('Product');
const Image = mongoose.model('Image');

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

    if (req.files === ' ') {
      postImageToBucket(req, res)
        .then((imageName) => {
          const image = new Image({
            url: `${process.env.SPACES_URL}/${imageName}`,
            alt,
            userId: _id,
          });
          return image.save();
        })
        .then((image) => {
          const product = new Product({
            productName,
            productDescription,
            price,
            images: [image.url],
          });

          return product.save();
        })
        .then(categories => res.send(categories))
        .catch(err => res.status(400).send(err));
    } else {
      const product = new Product({
        productName,
        productDescription,
        price,
      });

      product.save()
        .then(categories => res.send(categories))
        .catch(err => res.status(400).send(err));
    }
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
