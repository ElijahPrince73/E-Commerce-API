const mongoose = require('mongoose');
const authenticate = require('../middleware/auth');

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');

module.exports = (app) => {
  // Add product to category
  app.post('/api/category-with-product/:categoryId', authenticate, (req, res) => {
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
        return category.save();
      }).then(newCategory => res.send(newCategory));
  });

  // Delete product within category
  app.delete('/api/category-with-product/:categoryId', authenticate, (req, res) => {
    const categoryId = req.params.categoryId;
    const { productId } = req.body;

    // Finds category with the id
    Category.findById(categoryId)
      .then((category) => {
        // used to filter for product we want to delete
        const updatedProductList = category.productList.filter((product) => {
          const productID = JSON.stringify(product._id);
          const deletedId = JSON.stringify(productId);
          return productID !== deletedId;
        });

        // reassign productList to category
        category.productList = updatedProductList;

        return category.save();
      })
      .then((newCategory) => {
        res.send(newCategory);
      });
  });
};
