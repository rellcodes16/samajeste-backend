const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'quotes',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

module.exports = storage;
