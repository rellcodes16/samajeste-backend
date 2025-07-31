const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    about: {
        type: String,
        required: true
    },
    mediaURL: {
        type: [String],
    },
    pfp: {
        type: String,
    }
});

authorSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "author",
  justOne: false,
});
authorSchema.set("toObject", { virtuals: true });
authorSchema.set("toJSON", { virtuals: true });


module.exports = mongoose.model("Author", authorSchema);