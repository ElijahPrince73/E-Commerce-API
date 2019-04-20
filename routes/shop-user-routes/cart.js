/* eslint eqeqeq: 0 */ // --> OFF
const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const ShopUser = mongoose.model('ShopUser');
const authenticate = require('../../middleware/shop-user-auth');

module.exports = (app) => {
  // Add product to cart
  app.post('/api/add-to-cart', authenticate, async (req, res) => {
    const { productId, quantity } = req.body;
    const { _id } = req.user._id;

    // Finds product
    const product = await Product.findById(productId);

    // Find user
    ShopUser.findById(_id)
      .then((user) => {
        const cart = user.cart;

        // Assign the quanity to the product we previously found
        product.quantity = quantity;

        // adds the product found to the carts array
        cart.push(product);

        const total = cart.reduce((a, b) => a + b.price, 0);

        user.cart = cart;
        user.totalItemsInCart = cart.length;
        user.totalAmount = total;

        return user.save();
      })
      .then((user) => {
        res.send(user);
      }).catch((err) => {
        res.send(err);
      });
  });

  // Remove from cart
  app.delete('/api/delete-product-from-cart', authenticate, (req, res) => {
    const { productId } = req.body;
    const { _id } = req.user._id;

    ShopUser.findById(_id)
      .then((user) => {
        const cart = user.cart;

        // Loose way of finding the product in the cart based 0f ID
        const removedProductArr = cart.filter(product => product._id != productId);

        // Add back the array
        user.cart = removedProductArr;

        return user.save();
      })
      .then(() => res.send('Deleted from cart'))
      .catch((err) => {
        res.send(err);
      });
  });

  // Change quantity of product
  app.put('/api/change-product-quanity', authenticate, (req, res) => {
    const { productId, quantity } = req.body;
    const { _id } = req.user._id;

    ShopUser.findById(_id)
      .then((user) => {
        const cart = user.cart;
        // Find index of the product in the array
        const indexToUpdate = cart.findIndex(product => product._id == productId);

        // Grab the product
        const productToUpdate = cart.find(product => product._id == productId);

        // Update quanity
        productToUpdate.quantity = quantity;

        // Remove and update with updated quanity
        cart.splice(indexToUpdate, 1, productToUpdate);

        return user.save();
      })
      .then(() => res.send('Success'))
      .catch((err) => {
        res.send(err);
      });
  });

  // Get products in cart
  app.get('/api/cart', authenticate, (req, res) => {
    const { _id } = req.user._id;

    ShopUser.findById(_id)
      .then((user) => {
        const cart = user.cart;
        res.send(cart);
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
