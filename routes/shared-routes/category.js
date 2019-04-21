const mongoose = require('mongoose');
const authHandler = require('../../middleware/middleware-handler');

const Category = mongoose.model('Category');

module.exports = (app) => {
  // Get all categories
  app.get('/api/category', authHandler, (req, res) => {
    Category.find({})
      .then(categories => res.send(categories))
      .catch(err => res.status(400).send(err));
  });

  // Get one category
  app.get('/api/category/:categoryId', authHandler, (req, res) => {
    Category.findById(req.params.categoryId)
      .then(category => res.send(category))
      .catch(err => res.status(400).send(err));
  });
};
