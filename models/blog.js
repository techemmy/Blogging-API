const mongoose = require("mongoose");
const { calculateReadingTime } = require("../utils");
const Schema = mongoose.Schema;

const blogStates = {
    draft: "draft",
    published: "published"
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
        enum: Object.values(blogStates),
        lowercase: true
    },
    read_count: {
        type: Number,
        default: 0
    },
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

BlogSchema.methods = {
    updateOneReadCount: async function () {
        this.read_count++;
        await this.save();
    }
}

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = {
    Blog,
    blogStates
}