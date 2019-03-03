/* eslint-disable */
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config({ path: './.env.default' });

module.exports = (req, res) => {
  // Configure client for use with Spaces
  const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
  });

  const uploader = () => new Promise((resolve, reject) => {
    let fileName = '';
    const upload = multer({
      storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        acl: 'public-read',
        key(req, file, cb) {
          fileName = file.originalname;
          cb(null, file.originalname);
        },
      }),
    }).array('file', 10);

    upload(req, res, (error) => {
      if (error) {
        reject();
      }
      resolve(fileName);
    });
  });
  return uploader();
};
