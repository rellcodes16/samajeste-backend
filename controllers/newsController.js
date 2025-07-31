const News = require('../models/News');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');

exports.createNews = catchAsync(async (req, res, next) => {
  const { title, lead, thumbnail, URL } = req.body;

  if (!title || !thumbnail || !URL) {
    return next(new AppError('Title, thumbnail, and URL are required.', 400));
  }

  const news = await News.create({ title, lead, thumbnail, URL });

  res.status(201).json({
    status: 'success',
    data: news,
  });
});

exports.getAllNews = catchAsync(async (req, res, next) => {
  const newsList = await News.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: newsList.length,
    data: newsList,
  });
});
