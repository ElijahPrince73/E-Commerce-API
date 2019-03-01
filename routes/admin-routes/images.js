const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const authenticate = require('../../middleware/auth');
require('dotenv').config({ path: './.env.default' });

module.exports = (app) => {
  app.post('/api/upload', authenticate, (req, res) => {
    const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
    });

    let emptyImage = {};

    const upload = multer({
      storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        key(req, file, cb) {
          emptyImage = file;
          cb(null, file.originalname);
        },
      }),
    }).array('file', 10);

    upload(req, res, (error) => {
      if (error) {
        res.status(400).send('Error uploading image');
      }
    });

    const image = new Image({
      url: `${process.env.SPACES_URL}/${emptyImage.originalname}`,
      alt,
    });

    image.save()
      .then(() => {
        res.send('Image upload success');
      })
      .catch(() => {
        res.status(400).send('Error saving image to DB');
      });
  });
};
