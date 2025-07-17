const express = require('express');
const multer = require('multer');
const quoteController = require('../controllers/quotesController');
const storage = require('../utils/cloudinaryStorage');

const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .post(upload.single('photo'), quoteController.createQuote) 
  .get(quoteController.getAllQuotes); 

router
  .route('/:id')
  .delete(quoteController.deleteQuote);

module.exports = router;
