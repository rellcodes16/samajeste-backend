const axios = require('axios');
const streamifier = require('streamifier');
const cloudinary = require('./cloudinaryConfig');

const uploadFromUrl = async (imageUrl, publicId) => {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  const buffer = Buffer.from(response.data, 'utf-8');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'notable-women',
        public_id: publicId,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadFromUrl;
