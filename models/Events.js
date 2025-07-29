const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    venue: {
        type: String,
        required: true,
    },
    registerURL: {
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
    },
    startTime: {
        type: String, 
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model("Event", eventSchema);