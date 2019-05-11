
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.default' });
const postImageToBucket = require('./post-image-to-bucket');

const Product = mongoose.model('Product');
const Image = mongoose.model('Image');

module.exports = (
  req,
  res,
  name,
  description,
  price,
  alt,
  userId,
  categories,
  sku,
  priceTaxExcl,
  priceTaxIncl,
  taxRate,
  width,
  height,
  depth,
  shippingFee,
  quantity,
  weight,
) => {
  if (Object.keys(req.files).length !== 0) {
    // send image to digital ocean bucket
    return postImageToBucket(req, userId)
      .then(images => Image.insertMany(images))
      .then((savedImages) => {
        // Create product
        const product = new Product({
          productName: name,
          productDescription: description,
          price: parseInt(price, 10).toFixed(2),
          userId,
          categories,
          sku,
          images: savedImages,
          priceTaxExcl,
          priceTaxIncl,
          taxRate,
          width,
          height,
          depth,
          shippingFee,
          quantity,
          weight,
        });

        return product.save();
      });
  }
  //  Only used if out req does't have files
  const product = new Product({
    productName: name,
    productDescription: description,
    price: parseInt(price, 10).toFixed(2),
    userId,
    categories,
    sku,
    priceTaxExcl,
    priceTaxIncl,
    taxRate,
    width,
    height,
    depth,
    shippingFee,
    quantity,
    weight,
  });

  return product.save();
};
