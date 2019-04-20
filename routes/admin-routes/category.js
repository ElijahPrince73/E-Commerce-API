const mongoose = require('mongoose');
const multer = require('multer');
const authenticate = require('../../middleware/admin-user-auth');
const createItem = require('../../utils/create-item');
require('dotenv').config({ path: './.env.default' });

// Used to read form-data sent from the client
const upload = multer();
const Category = mongoose.model('Category');

module.exports = (app) => {
  // Create new Category
  app.post('/api/category', upload.any(), authenticate, (req, res) => {
    const categoryValues = JSON.parse(req.body.text);

    let {
      categoryName, categoryDescription, alt,
    } = categoryValues;

    const _id = req.user._id;

    createItem(req, res, categoryName, categoryDescription, '', alt, _id, 'catgory')
      .then(category => res.send(category))
      .catch(err => res.status(400).send(err));
  });

  // Update category
  app.put('/api/category/:categoryId', authenticate, (req, res) => {
    const { categoryName, description } = req.body;
    Category.findByIdAndUpdate(
      { _id: req.params.categoryId },
      { $set: { categoryName, description } },
      { new: true },
    )
      .then(category => res.send(category))
      .catch(err => res.status(400).send(err));
  });

  // Delete Category
  app.delete('/api/category/:categoryId', authenticate, (req, res) => {
    Category.findByIdAndDelete(req.params.categoryId)
      .then(() => {
        res.status(200).send('Category deleted');
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  // Delete image from category
  app.delete('/api/category-image/:categoryId', authenticate, (req, res) => {
    const imageId = req.body.imageId;
    Category.findById(req.params.categoryId)
      .then((category) => {
        // used to filter for product images we want to delete
        const updatedImageList = category.images.filter((image) => {
          const imageID = JSON.stringify(image._id);
          const deletedId = JSON.stringify(imageId);
          return imageID !== deletedId;
        });

        // reassign productList to product
        category.images = updatedImageList;

        return category.save();
      })
      .then((newCategory) => {
        res.send(newCategory);
      });
  });
};
