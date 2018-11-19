const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CategoriesSchema = require('./Category')
const ProductSchema = require('./Product')
const OrdersSchema = require('./Orders')

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
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
  cart: {
    products: [ProductSchema],
  },
  orders: [OrdersSchema],
  categories: [CategoriesSchema]
});

UserSchema.methods.generateAuthToken = function (type) {
  const user = this;
  let access

  if (type === 'admin') {
    access = 'admin'
  } else {
    access = 'user'
  }

  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
      },
      'abc123',
    )
    .toString();

  user.tokens.push({
    access,
    token,
  });

  return user.save().then(() => token);
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this

  return User.findOne({ email })
    .then((user) => {
      if(!user) {
        return Promise.reject()
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res) {
            resolve(user)
          } else {
            reject()
          }
        })
      })
    })
}

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
