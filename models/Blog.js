const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lead: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", blogPostSchema);
