const Blog = require("../models/blog");

const getAllPublishedBlogs = (req, res) => {

    res.status(200).json({blogs: "All"})
}

module.exports = {
    getAllPublishedBlogs
}