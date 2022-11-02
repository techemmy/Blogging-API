const mongoose = require("mongoose");
const { calculateReadingTime } = require("../utils");
const Schema = mongoose.Schema;

const blogStates = {
    draft: "Draft",
    published: "Published"
}

const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Blog title is required!"],
        unique: true
    },
    description: String,
    body: {
        type: String,
        required: [true, "Blog body is required!"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    state: {
        type: String,
        required: [true, "Blog state cannot be empty!"],
        default: "draft",
        enum: Object.values(blogStates)
    },
    read_count: Number,
    reading_time: String,
    tags: {
        type: [String],
        lowercase: true
    }
}, {timestamps: true})

BlogSchema.pre("save", function(next) {
    this.reading_time = calculateReadingTime(this.title, this.body);
    next();
})

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = {
    Blog,
    blogStates
}