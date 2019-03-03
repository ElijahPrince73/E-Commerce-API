const mongoose = require('mongoose');
const postImageToBucket = require('../../utils/postImageToBucket');
const authenticate = require('../../middleware/auth');

const Image = mongoose.model('Image');
require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  app.post('/api/upload', authenticate, (req, res) => {
    const { alt, _id } = req.body;

    postImageToBucket(req, res)
      .then((imageName) => {
        const image = new Image({
          url: `${process.env.SPACES_URL}/${imageName}`,
          alt,
          userId: _id,
        });
        return image.save();
      })
      .then(() => {
        res.send('Image upload success');
      })
      .catch(() => {
        res.status(400).send('Error saving image to DB');
      });
  });
};
