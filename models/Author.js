const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true
    },
    mediaURL: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Author", authorSchema);