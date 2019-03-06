const mongoose = require('mongoose');
const multer = require('multer');
const postImageToBucket = require('../../utils/post-image-to-bucket');
const postManyImagesToBucket = require('../../utils/post-many-images-to-bucket');
const deleteImageFromBucket = require('../../utils/delete-image-from-bucket');
const authenticate = require('../../middleware/auth');

const Image = mongoose.model('Image');
require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  const multipleUpload = multer().array('file');
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

  app.post('/api/upload-many', multipleUpload, authenticate, (req, res) => {
    const { alt, _id } = req.body;

    postManyImagesToBucket(req, res)
      .then((imageName) => {
        const image = new Image({
          url: `${process.env.SPACES_URL}/${imageName}`,
          alt,
          userId: _id,
        });
        return image.save();
      })
      .then(() => {
        res.send('Image uploads success');
      })
      .catch(() => {
        res.status(400).send('Error saving images to DB');
      });
  });

  app.delete('/api/delete-image', authenticate, (req, res) => {
    const imageId = req.body.imageId;
    deleteImageFromBucket(imageId)
      .then(() => {
        res.send('Image deleted from bucket');
      }).catch((err) => {
        res.status(400).send(err);
      });
  });
};
