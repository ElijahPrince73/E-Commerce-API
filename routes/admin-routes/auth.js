const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (app) => {
  // ADMIN Auth Routes
  app.post('/api/adminregister', (req, res) => {
    if (req.body.password !== req.body.passwordConf) {
      res.status(403).send({
        errorMessage: 'Password and Password Confirmation Do Not Match',
      });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    user.save()
      .then(() => user.generateAuthToken('admin'))
      .then((token) => {
        res.header('x-auth', token).send(user);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  app.post('/api/adminlogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByCredentials(email, password)
      .then(user => user.generateAuthToken('admin')
        .then((token) => {
          res.header('x-auth', token).send(user);
        })).catch(() => {
        res.status(403).send({
          errorMessage: 'Invalid Login',
        });
      });
  });
};
