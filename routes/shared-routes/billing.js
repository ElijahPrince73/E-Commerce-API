const DB_STRIPE_KEY = process.env.DB_STRIPE_KEY;
const stripe = require('stripe')(DB_STRIPE_KEY);
const mongoose = require('mongoose');
const authHandler = require('../../middleware/middleware-handler');

const ShopUser = mongoose.model('ShopUser');
const OrdersSchema = mongoose.model('Order');

require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  // Creates a stripe charge and an order
  app.post('/api/payment', authHandler, (req, res) => {
    const {
      _id,
      cart,
      email,
      totalItemsInCart,
      totalAmount,
    } = req.user;

    const {
      stripeToken,
      address,
      address2,
      zip,
    } = req.body;

    stripe.charges
      .create({
        amount: Math.round(totalAmount * 100),
        currency: 'usd',
        description: 'Customer payment',
        source: stripeToken,
      })
      .then(() => {
        const order = new OrdersSchema({
          userId: _id,
          email,
          productList: cart,
          address,
          address2,
          zip,
          totalAmount,
          items: totalItemsInCart,
        });
        return order.save();
      })
      .then(() => ShopUser.findById(_id))
      .then((user) => {
        user.cart = [];
        return user.save();
      })
      .then(user =>
        res.send({
          user,
          message: 'Payment Success',
        }))
      .catch((err) => {
        res.status(400).send({
          err,
          message: 'An Error occured',
        });
      });
  });
};
