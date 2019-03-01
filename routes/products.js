const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const authenticate = require('../middleware/auth');
require('dotenv').config({ path: './.env.default' });

const Product = mongoose.model('Product');
const Image = mongoose.model('Image');

module.exports = (app) => {
  // Create new product
  app.post('/api/product', authenticate, (req, res) => {
    console.log(req);
    const {
      productName, productDescription, price, alt,
    } = req.body;
    // Configure client for use with Spaces
    const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
    });

    let emptyImage = {};

    const upload = multer({
      storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        key(req, file, cb) {
          emptyImage = file;
          cb(null, file.originalname);
        },
      }),
    }).array('file', 10);

    upload(req, res, (error) => {
      if (error) {
        res.status(400).send('Error uploading image');
      }
    });

    const image = new Image({
      url: `${process.env.SPACES_URL}/${emptyImage.originalname}`,
      alt,
    });

    const product = new Product({
      productName,
      productDescription,
      price,
      image: [image],
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
