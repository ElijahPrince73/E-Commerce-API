const DB_STRIPE_KEY = process.env.DB_STRIPE_KEY;
const stripe = require('stripe')(DB_STRIPE_KEY);
const mongoose = require('mongoose');

const ShopUser = mongoose.model('ShopUser');

require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  app.post('/api/payment', (req, res) => {
    const { _id, cart } = req.user;
    const { stripeToken, total, order } = req.body;
    stripe.charges.create({
      amount: total,
      currency: 'usd',
      description: 'Customer payment',
      source: stripeToken,
      order: cart,
      metadata: {
        userId: `${_id}`,
        order,
      },
    })
      .then(() => ShopUser.findById(_id))
      .then((user) => {
        user.cart = [];
        return user.save();
      })
      .then(user => res.send({
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
