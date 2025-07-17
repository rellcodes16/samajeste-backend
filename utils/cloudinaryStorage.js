// utils/cloudinaryStorage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // ✅ import the configured instance

const storage = new CloudinaryStorage({
  cloudinary, // this is now the correctly configured instance
  params: {
    folder: 'quotes',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

module.exports = storage;
