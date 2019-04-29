const mongoose = require('mongoose');
const authenticate = require('../../middleware/admin-user-auth');
require('dotenv').config({ path: './.env.default' });

const Category = mongoose.model('Category');

module.exports = (app) => {
  // Create new Category
  app.post('/api/categories', authenticate, (req, res) => {
    const {
      categoryName, categoryDescription,
    } = req.body;

    const _id = req.user._id;

    const category = new Category({
      categoryName,
      categoryDescription,
      userId: _id,
    });

    category.save()
      .then(() => res.send('Category Created'))
      .catch(err => res.status(400).send(err));
  });

  // Update category
  app.put('/api/categories', authenticate, (req, res) => {
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
  app.post('/api/categories-delete', authenticate, (req, res) => {
    const { ids } = req.body;

    Category.deleteMany({ _id: ids.map(id => id) })
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
