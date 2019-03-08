const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CategoriesSchema = require('./Category');
const ProductSchema = require('./Product');
const CartSchema = require('./Cart');
const OrdersSchema = require('./Orders');

const UserSchema = new mongoose.Schema({
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
  cart: [CartSchema],
  orders: [OrdersSchema],
  categories: [CategoriesSchema],
  products: [ProductSchema],
  access: {
    type: String,
  },
});

UserSchema.methods.generateAuthToken = function (type) {
  const user = this;
  let access;

  if (type === 'admin') {
    access = 'admin';
  } else {
    access = 'user';
  }

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

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email })
    .then((user) => {
      // Will only work if we have a user with a certain access level
      if (user && (user.access === 'admin' || user.access === 'user')) {
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
UserSchema.statics.findByToken = function (token) {
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
UserSchema.pre('save', function (next) {
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

mongoose.model('User', UserSchema);
