const mongoose = require('mongoose');

const ShopUser = mongoose.model('ShopUser');

module.exports = (app) => {
  // Register User Route
  app.post('/api/register', (req, res) => {
    if (req.body.password !== req.body.passwordConf) {
      res.status(403).send({
        errorMessage: 'Password and Password Confirmation Do Not Match',
      });
    }

    const user = new ShopUser({
      email: req.body.email,
      password: req.body.password,
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
    const email = req.body.email;
    const password = req.body.password;

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
