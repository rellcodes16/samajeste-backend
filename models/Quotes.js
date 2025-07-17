const mongoose = require("mongoose");

const quotesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    quote: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Quotes", quotesSchema);