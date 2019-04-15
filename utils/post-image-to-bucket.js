/* eslint-disable */
const AWS = require('aws-sdk');
require('dotenv').config();

module.exports = (req, userId) => new Promise((resolve, reject) => {
  let images = [];

  const success = (image) => {
    image.url = image.Location;
    image.userId = userId;

    images.push(image);

    if (req.files.length === images.length) {
      resolve(images);
    }
  };

  // Configure client for use with Spaces
  const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);

  const config = {
    endpoint: spacesEndpoint,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
  }

  const s3 = new AWS.S3(config);
  const files = req.files;

  files.map((file) => {
    const params = {
      Bucket: 'e-commerce-media',
      Body: file.buffer,
      Key: file.originalname,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      // handle error
      if (err) {
        console.log(err)
        reject(err);
      }

      // success
      if (data) {
        success(data);
      }
    });
  });
});
