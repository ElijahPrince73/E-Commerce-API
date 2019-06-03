const mongoose = require('mongoose');
const authenticate = require('../../middleware/admin-user-auth');

const AdminUser = mongoose.model('AdminUser');

module.exports = (app) => {
  // Admin register
  app.post('/api/admin-register', (req, res) => {
    const {
      name, email, password, passwordConf,
    } = req.body;

    if (password !== passwordConf) {
      res.status(403).send({
        errorMessage: 'Password and Password Confirmation Do Not Match',
      });
    }

    const user = new AdminUser({
      name,
      email,
      password,
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
    const {
      email, password,
    } = req.body;

    AdminUser.findByCredentials(email, password)
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

  app.post('/api/logout', authenticate, (req, res) => {
    const { token } = req.body;
    const { tokens } = req.user;
    const indexOfToken = tokens.findIndex(tokenObj => tokenObj.token === token);
    tokens.splice(indexOfToken, 1);
    res.status(200).send();
  });
};
