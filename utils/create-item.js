
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.default' });
const postImageToBucket = require('./post-image-to-bucket');

const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Image = mongoose.model('Image');

module.exports = (req, res, name, description, price, alt, userId, item) => {
  // Find out if we adding a image to a product or category
  if (item === 'product') {
    // If our object has files to it
    if (Object.keys(req.files).length !== 0) {
      // send image to digital ocean bucket
      return postImageToBucket(req, res)
        .then((imageName) => {
          // Save image info to DB
          const image = new Image({
            url: `${process.env.SPACES_URL}/${imageName}`,
            alt,
            userId,
            fileName: imageName,
          });
          return image.save();
        })
        .then((image) => {
          // Create product
          const product = new Product({
            productName: name,
            productDescription: description,
            price,
            userId,
            images: [image],
          });

          return product.save();
        });
    }
    //  Only used if out req does't have files
    const product = new Product({
      productName: name,
      productDescription: description,
      price,
      userId,
    });

    return product.save();
  }

  // else catgory
  if (Object.keys(req.files).length !== 0) {
    return postImageToBucket(req, res)
      .then((imageName) => {
        const image = new Image({
          url: `${process.env.SPACES_URL}/${imageName}`,
          alt,
          userId,
          fileName: imageName,
        });

        return image.save();
      })
      .then((image) => {
        const category = new Category({
          categoryName: name,
          categoryDescription: description,
          image: image.url,
        });

        return category.save();
      });
  }
  const category = new Category({
    categoryName: name,
    categoryDescription: description,
  });

  return category.save();
};
