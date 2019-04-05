/* eslint-disable */
const AWS = require('aws-sdk');
require('dotenv').config({ path: './.env.default' });

module.exports = (req, res) => {
  // Configure client for use with Spaces
  const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
  AWS.config.update({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
  });

  const uploader = () => new Promise((resolve, reject) => {
    const s3 = new AWS.S3();

    const fileName = req.files[0].originalname
    const mimetype = req.files[0].mimetype

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Body: fileName,
      Key: fileName,
      ACL: 'public-read',
      ContentType: mimetype,
    };

    s3.upload(params, function (err, data) {
      //handle error
      if (err) {
        reject(err)
      }

      //success
      if (data) {
        resolve(data.key)
      }
    });
  });
  return uploader();
};
