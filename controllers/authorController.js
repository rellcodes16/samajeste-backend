const Author = require("../models/Author");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const Blog = require("../models/Blog");


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

exports.getBlogsByAuthor = catchAsync(async (req, res, next) => {
  const { authorId } = req.params;
  const { page = 1, limit = 10, search = '' } = req.query;

  const query = {
    author: authorId,
    ...(search && {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("author");

  const total = await Blog.countDocuments(query);

  res.status(200).json({
    status: 'success',
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    data: blogs,
  });
});
