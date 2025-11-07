const Author = require("../models/Author");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const Blog = require("../models/Blog");
const { uploadFromUrl } = require('../utils/uploadFromUrl');
const cloudinary = require('cloudinary');
const connectDB = require("../utils/connectDB");

exports.createAuthor = catchAsync(async (req, res, next) => {
  await connectDB()

  const { name, about, mediaURL } = req.body;

  if (!name || !about || !mediaURL || !Array.isArray(mediaURL)) {
    throw new ApiError(400, "Name, about, and an array of media URLs are required");
  }

  let pfp;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "authors",
    });
    pfp = result.secure_url;
  }

  const author = await Author.create({
    name,
    about,
    mediaURL,
    pfp,
  });

  res.status(201).json({
    status: "success",
    data: author,
  });
});

exports.updateAuthor = catchAsync(async (req, res, next) => {
  await connectDB()

  const { authorId } = req.params;
  const updates = req.body;

  const raw = req.body.mediaURL;
  if (raw !== undefined) {
    if (typeof raw === 'string') {
      updates.mediaURL = [raw];
    } else if (Array.isArray(raw)) {
      updates.mediaURL = raw;
    } else {
      throw new ApiError(400, 'mediaURL must be an array or a string');
    }
  }

  const author = await Author.findById(authorId);
  if (!author) throw new ApiError(404, 'Author not found');

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'authors',
    });
    updates.pfp = result.secure_url;
  }

  const updatedAuthor = await Author.findByIdAndUpdate(authorId, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedAuthor,
  });
});

exports.getAuthorById = catchAsync(async (req, res, next) => {
  await connectDB()

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
  await connectDB()

  const authors = await Author.find();

  res.status(200).json({
    status: "success",
    results: authors.length,
    data: authors,
  });
});

exports.getBlogsByAuthor = catchAsync(async (req, res, next) => {
  await connectDB()
  
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
