const mongoose = require('mongoose');

const ShopUser = mongoose.model('ShopUser');

module.exports = (req, res, next) => {
  const token = req.header('x-auth');

  ShopUser.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      return next();
    }).catch(() => {
      res.status(401).send('Invalid Request');
    });
};
