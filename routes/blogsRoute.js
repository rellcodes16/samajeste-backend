const express = require('express');
const blogController = require('../controllers/blogpostController');

const router = express.Router();

router
  .route('/')
  .post(blogController.createBlogPost)
  .get(blogController.getAllBlogPosts);

router
  .route('/:id')
  .get(blogController.getBlogPost)
  .patch(blogController.updateBlogPost)
  .delete(blogController.deleteBlogPost);

router.get("/slug/:slug", blogController.getBlogPostBySlug);

module.exports = router;
