const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const multer = require("multer");
const storage = require("../utils/cloudinaryStorage"); 
const upload = multer({ storage });

router.post('/', upload.single('pfp'), authorController.createAuthor);
router.patch('/:authorId', upload.single('pfp'), authorController.updateAuthor);
router.get("/:id", authorController.getAuthorById);
router.get("/", authorController.getAllAuthors);
router.get('/:authorId', authorController.getBlogsByAuthor);

module.exports = router;
