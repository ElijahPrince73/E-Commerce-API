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
  // Change quantity of product
  // Get products in cart
  // Delete entire cart after purchase
};
