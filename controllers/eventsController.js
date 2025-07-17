const Event = require('../models/Events');
const catchAsync = require('../utils/catchAsync');
const uploadFromUrl = require('../utils/uploadFromURL');
const cloudinary = require('../utils/cloudinaryConfig');

exports.createEvent = catchAsync(async (req, res) => {
  const { name, description, venue, registerURL, thumbnail, date } = req.body;

  if (!thumbnail) {
    return res.status(400).json({
      status: 'fail',
      message: 'Image URL is required',
    });
  }

  let uploadedThumbnailUrl;
  try {
    const cleanPublicId = name
        .replace(/[^a-zA-Z0-9 ]/g, '')   
        .trim()
        .replace(/\s+/g, '_')           
         + '_event';


    uploadedThumbnailUrl = await uploadFromUrl(thumbnail, cleanPublicId);

  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to upload image to Cloudinary',
      error: err.message,
    });
  }

  const newEvent = await Event.create({
    name,
    description,
    venue,
    registerURL,
    thumbnail: uploadedThumbnailUrl,
    date,
  });

  res.status(201).json({
    status: 'success',
    data: newEvent,
  });
});

exports.getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find().sort({ date: 1 });

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: events,
  });
});

exports.getEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      status: 'fail',
      message: 'Event not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

exports.deleteEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      status: 'fail',
      message: 'Event not found',
    });
  }

  try {
    const publicId = event.thumbnail
      .split('/')
      .slice(-1)[0]
      .split('.')[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Could not delete image from Cloudinary:', err.message);
  }

  await event.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

