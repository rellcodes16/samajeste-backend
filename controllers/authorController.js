const Author = require("../models/Author");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");


exports.createAuthor = catchAsync(async (req, res, next) => {
  const { name, about, mediaURL } = req.body;

  if (!name || !about || !mediaURL || !Array.isArray(mediaURL)) {
    throw new ApiError(400, "Name, about, and an array of media URLs are required");
  }

  const author = await Author.create({ name, about, mediaURL });

  res.status(201).json({
    status: "success",
    data: author,
  });
});

exports.getAuthorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const author = await Author.findById(id).populate("blogs");

  if (!author) {
    throw new ApiError(404, "Author not found");
  }

  res.status(200).json({
    status: "success",
    data: author,
  });
});

exports.getAllAuthors = catchAsync(async (req, res, next) => {
  const authors = await Author.find();

  res.status(200).json({
    status: "success",
    results: authors.length,
    data: authors,
  });
});
