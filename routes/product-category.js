const mongoose = require('mongoose');

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');

module.exports = (app) => {
  // Update category
  app.post('/api/category-with-product/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const { productName, productDescription } = req.body;

    Category.findById(categoryId)
      .then((category) => {
        // Creates our product
        const product = new Product({
          productName,
          productDescription,
          category: category._id,
        });

        category.productList.push(product);
        return category.save().then(newCategory => res.send(newCategory));
      });
  });

  app.get('/api/category-with-product/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    Category
      .findById(categoryId)
      .populate({
        path: 'productList.product',
        model: 'Product',
      })
      .exec((err, category) => {
        console.log(category);
      });
  });
};