/* eslint eqeqeq: 0 */ // --> OFF
const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const User = mongoose.model('User');

module.exports = (app) => {
  // Add product to cart
  app.post('/api/add-to-cart', (req, res) => {
    const {
      productId, quantity, userId,
    } = req.body;

    let productItem = {};
    // Find product
    Product.findById(productId)
      .then(product => productItem = product);
    // Find user
    User.findById(userId)
      .then((user) => {
        // Assign the quanity to the product we previously found
        productItem.quantity = quantity;

        const cart = user.cart;

        // TODO: fix all this
        // Only way to add products to cart using current schema
        cart.push({ cartProducts: [] });

        // adds the product found to the cartProducts array
        cart[0].cartProducts.push(productItem);

        // Calcs total
        const total = cart[0].cartProducts.map((product) => {
          let totalAmount = 0;

          totalAmount += product.price;

          return totalAmount;
        });

        // Still hacky
        // assigns the cartProducts array to the cart
        const cartProducts = cart[0].cartProducts;

        const updatedCart = {
          cartProducts,
          total: total[0],
          items: cartProducts.length,
        };

        user.cart = updatedCart;

        return user.save();
      })
      .then((user) => {
        res.send(user);
      }).catch((err) => {
        res.send(err);
      });
  });
  // Remove from cart
  app.delete('/api/delete-product-from-cart', (req, res) => {
    const {
      productId, userId,
    } = req.body;

    User.findById(userId)
      .then((user) => {
        const cart = user.cart[0].cartProducts;

        // Loose way of finding the product in the cart based 0f ID
        const removedProductArtr = cart.filter(product => product._id != productId);

        // Add back the array
        user.cart[0].cartProducts = removedProductArtr;

        return user.save();
      })
      .then(() => res.send('Deleted from cart'))
      .catch((err) => {
        res.send(err);
      });
  });

  // Change quantity of product
  app.put('/api/change-product-quanity', (req, res) => {
    const {
      productId, userId, quantity,
    } = req.body;

    User.findById(userId)
      .then((user) => {
        const cart = user.cart[0].cartProducts;
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
  app.get('/api/cart', (req, res) => {
    const {
      userId,
    } = req.body;

    User.findById(userId)
      .then((user) => {
        const cart = user.cart[0].cartProducts;
        res.send(cart);
      })
      .catch((err) => {
        res.send(err);
      });
  });
};
