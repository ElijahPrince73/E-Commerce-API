const mongoose = require('mongoose');
const authenticate = require('../../middleware/auth');

const User = mongoose.model('User');

module.exports = (app) => {
  // Admin register
  app.post('/api/admin-register', (req, res) => {
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
        res.header('x-auth', token).send(token);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  // Admin login
  app.post('/api/admin-login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByCredentials(email, password)
      .then(user => user.generateAuthToken('admin')
        .then((token) => {
          res.header('x-auth', token).send(token);
        }))
      .catch(() => {
        res.status(403).send({
          errorMessage: 'Invalid Login',
        });
      });
  });

  app.get('/api/me', authenticate, (req, res) => {
    res.send(req.user);
  });

  app.delete('/api/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      },
    );
  });
};
