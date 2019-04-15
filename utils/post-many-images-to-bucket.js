/* eslint-disable */
const AWS = require('aws-sdk');
const multer = require('multer');
require('dotenv').config({ path: './.env.default' });

module.exports = (req, res) => {
    const file = req.files;
    const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_NAME);
    let s3bucket = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_key,
        Bucket: process.env.BUCKET_NAME
    });
    return new Promise((resolve, reject) => {
        s3bucket.createBucket(function () {
            file.map((file) => {
                var params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: file.originalname,
                    Body: file.buffer,
                    ACL: 'public-read',
                    ContentType: mimetype,
                };
                s3bucket.upload(params, function (err, data) {
                    if (err) {
                        reject(err)
                    } 
                    resolve()
                });
            });
        });
    })
};
