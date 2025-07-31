const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.route('/')
  .post(newsController.createNews)
  .get(newsController.getAllNews);

module.exports = router;
