const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  lead: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  tags: [String],
  author: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model("Blog", blogPostSchema);