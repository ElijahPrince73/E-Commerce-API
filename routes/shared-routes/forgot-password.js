const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const User = mongoose.model('User');
require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    User.findOne({ email })
      .then((user) => {
        let mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: 'Forgot Password',
          html: `<a href="http://localhost:3000/reset-password/${user._id}">Password Reset</a>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(`An email has been sent to ${user.email}`);
          }
        });
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  });
  app.post('/api/reset-password/:userId', (req, res) => {
    const { email } = req.params.userId;
    const { password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (req.body.password !== req.body.passwordConf) {
          res.status(403).send({
            errorMessage: 'Password and Password Confirmation Do Not Match',
          });
        }

        user.password = password;

        return user.save();
      })
      .then(user => user.generateAuthToken('user'))
      .then((token) => {
        res.header('x-auth', token).send('Password Updated');
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  });
};
