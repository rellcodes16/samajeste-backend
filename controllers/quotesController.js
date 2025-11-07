const Quote = require('../models/Quotes');
const catchAsync = require('../utils/catchAsync');
const uploadFromUrl = require('../utils/uploadFromUrl');
const cloudinary = require('../utils/cloudinaryConfig'); 
const connectDB = require('../utils/connectDB'); 

exports.createQuote = catchAsync(async (req, res) => {
  await connectDB(); 

  const { name, occupation, quote, photo } = req.body;

  if (!photo) {
    return res.status(400).json({
      status: 'fail',
      message: 'Image URL is required',
    });
  }

  let uploadedPhotoUrl;
  try {
    uploadedPhotoUrl = await uploadFromUrl(photo, name.replace(/\s+/g, '_'));
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to upload image to Cloudinary',
      error: err.message,
    });
  }

  const newQuote = await Quote.create({
    name,
    occupation,
    quote,
    photo: uploadedPhotoUrl,
  });

  res.status(201).json({
    status: 'success',
    data: newQuote,
  });
});

exports.getAllQuotes = catchAsync(async (req, res) => {
  await connectDB(); 

  const quotes = await Quote.find();

  res.status(200).json({
    status: 'success',
    results: quotes.length,
    data: quotes,
  });
});

exports.deleteQuote = catchAsync(async (req, res) => {
  await connectDB(); 

  const quote = await Quote.findById(req.params.id);
  
  if (!quote) {
    return res.status(404).json({
      status: 'fail',
      message: 'Quote not found',
    });
  }

  try {
    const publicId = quote.photo
      .split('/')
      .slice(-1)[0]
      .split('.')[0]; 

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary image delete failed:', err.message);
  }

  await quote.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
