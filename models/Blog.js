const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Blog", blogSchema);