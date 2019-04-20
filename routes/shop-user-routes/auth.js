const mongoose = require('mongoose');

const ShopUser = mongoose.model('ShopUser');

module.exports = (app) => {
  // Register User Route
  app.post('/api/register', (req, res) => {
    const {
      name, email, password, passwordConf,
    } = req.body;

    if (password !== passwordConf) {
      res.status(403).send({
        errorMessage: 'Password and Password Confirmation Do Not Match',
      });
    }

    const user = new ShopUser({
      name,
      email,
      password,
    });

    user.save()
      .then(() => user.generateAuthToken('user'))
      .then((token) => {
        res.header('x-auth', token).send(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  // Login User Route
  app.post('/api/login', (req, res) => {
    const {
      email, password,
    } = req.body;

    ShopUser.findByCredentials(email, password)
      .then(user => user.generateAuthToken('user')
        .then((token) => {
          res.header('x-auth', token).send(user);
        })).catch(() => {
        res.status(403).send({
          errorMessage: 'Invalid Login',
        });
      });
  });
};
