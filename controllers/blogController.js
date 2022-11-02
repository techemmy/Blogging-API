const {Blog, blogStates} = require("../models/blog");

const getAllPublishedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({state: blogStates.published})
        res.status(200).json({blogs: blogs})
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPublishedBlogs
}