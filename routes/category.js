const mongoose = require('mongoose');

const Category = mongoose.model('Category');

module.exports = (app) => {
  // Create new Category
  app.post('/api/category', (req, res) => {
    const category = new Category({
      categoryName: req.body.categoryName,
      description: req.body.description,
    });

    category.save()
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });

  // Get all categories
  app.get('/api/category', (req, res) => {
    Category.find({})
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });
};
