const mongoose = require('mongoose');
const authHandler = require('../../middleware/middleware-handler');

const Orders = mongoose.model('Order');

module.exports = (app) => {
  // Get all orders
  app.get('/api/orders', authHandler, (req, res) => {
    Orders.find()
      .then((orders) => {
        res.send(orders);
      })
      .catch(err => res.status(400).send(err));
  });

  // Get one order
  app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    Orders.findById({ _id: orderId })
      .then((order) => {
        res.send(order);
      })
      .catch(err => res.status(400).send(err));
  });
};
