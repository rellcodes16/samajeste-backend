const Blog = require('../models/Blog');
const uploadFromUrl = require('../utils/uploadFromUrl');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');
const sanitizeHtml = require('sanitize-html');

exports.createBlogPost = catchAsync(async (req, res, next) => {
  const { title, thumbnail, tags, author, lead } = req.body;

  if (!title || !thumbnail || !author) {
    return next(new AppError('Title, thumbnail, and author are required', 400));
  }
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const publicId = slug + '_thumbnail';
  const thumbnailUrl = await uploadFromUrl(thumbnail, publicId);

  const newPost = await Blog.create({
    title,
    lead,
    slug,
    thumbnail: thumbnailUrl,
    tags,
    author,
  });

  res.status(201).json({ status: 'success', data: newPost });
});


exports.updateBlogPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, thumbnail, content, tags } = req.body;

  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError('Blog post not found', 404));

  if (thumbnail && thumbnail !== blog.thumbnail) {
    const publicId = title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '_') + '_thumbnail';
    blog.thumbnail = await uploadFromUrl(thumbnail, publicId);
  }

  if (content) {
    let updatedContent = content;
    const imageUrlRegex = /<img[^>]+src="([^">]+)"/g;
    const uploadedImageMap = {};

    let match;
    while ((match = imageUrlRegex.exec(content)) !== null) {
      const imageUrl = match[1];
      if (!uploadedImageMap[imageUrl]) {
        const newUrl = await uploadFromUrl(imageUrl, uuidv4());
        uploadedImageMap[imageUrl] = newUrl;
      }
    }

    Object.entries(uploadedImageMap).forEach(([originalUrl, newUrl]) => {
      updatedContent = updatedContent.replace(new RegExp(originalUrl, 'g'), newUrl);
    });

    blog.content = sanitizeHtml(updatedContent, sanitizeConfig);
  }

  if (title) blog.title = title;
  if (tags) blog.tags = tags;

  await blog.save();

  res.status(200).json({ status: 'success', data: blog });
});

exports.getAllBlogPosts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      }
    : {};

  const skip = (page - 1) * limit;

  const blogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Blog.countDocuments(query);

  res.status(200).json({
    status: 'success',
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    data: blogs,
  });
});

exports.getBlogPost = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError('Blog post not found', 404));

  res.status(200).json({ status: 'success', data: blog });
});

exports.deleteBlogPost = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog post not found', 404));

  res.status(204).json({ status: 'success', data: null });
});
