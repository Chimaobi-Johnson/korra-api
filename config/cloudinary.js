const cloudinary = require('cloudinary').v2;

const keys = require("./keys");

cloudinary.config({
  cloud_name: 'marvtech',
  api_key: keys.cloudinaryAPIKey,
  api_secret: keys.cloudinarySecretKey
});
