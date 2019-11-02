/* eslint-disable */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CategoriesSchema = require('./Category');
const ProductSchema = require('./Product');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  categories: [CategoriesSchema],
  products: [ProductSchema],
  access: String
});

AdminSchema.methods.generateAuthToken = function (type) {
  const user = this;
  let access = 'admin';;

  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
      },
      'abc123',
    )
    .toString();

  user.tokens.push({
    token,
  });
  user.access = access;

  return user.save().then(() => token);
};

AdminSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email })
    .then((user) => {
      // Will only work if we have a user with a certain access level
      if (user && user.access === 'admin') {
        console.log('success');
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            } else {
              reject();
            }
          });
        });
      }
      return Promise.reject();
    });
};

// Model Method to findByToken
AdminSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    // Verify that the token is something we created
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
  });
};

// Creates hashed password
AdminSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

mongoose.model("AdminUser", AdminSchema, "AdminUser");
