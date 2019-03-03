const mongoose = require('mongoose');
const authenticate = require('../../middleware/auth');

const Category = mongoose.model('Category');

module.exports = (app) => {
  // Create new Category
  app.post('/api/category', authenticate, (req, res) => {
    const category = new Category({
      categoryName: req.body.categoryName,
      description: req.body.description,
    });

    category.save()
      .then(categories => res.send(categories))
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
};
