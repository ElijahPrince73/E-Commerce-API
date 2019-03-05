const AWS = require('aws-sdk');
const mongoose = require('mongoose');

const Image = mongoose.model('Image');

module.exports = imageId => Image.findById(imageId)
  .then((image) => {
    const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
    AWS.config.update({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: image.fileName,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err, err.stack);
        } else {
          resolve(data);
        }
      });
    });
  }).catch(err => new Promise((resolve, reject) => {
    reject(err);
  }));
