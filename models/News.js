const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    lead: {
        type: String,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    URL:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("New", newsSchema);