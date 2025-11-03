const dotenv = require("dotenv");
const path = require("path");


dotenv.config({ path: path.join(__dirname, "../.env") });

// console.log("ENV CHECK:");
// console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API key:", process.env.CLOUDINARY_API_KEY);
// console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "present" : "missing");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
