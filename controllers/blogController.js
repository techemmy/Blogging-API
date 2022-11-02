const {Blog, blogStates} = require("../models/blog");
const { isValidObjectId } = require("../utils");

const getAllPublishedBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({state: blogStates.published})
        res.status(200).json({blogs: blogs})
    } catch (error) {
        next(error);
    }
}

const getPublishedBlogById = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        if (!isValidObjectId(blogId)) {
            const error =  Error("Invalid blog id")
            error.status = 400, error.statusCode = 400;
            throw error
        }

        const blog = await Blog.findById(blogId)
        res.status(200).json({blog})
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPublishedBlogs,
    getPublishedBlogById
}