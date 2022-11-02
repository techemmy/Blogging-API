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
            return res.status(400).json({error: "Invalid blog id"})
        }

        const blog = await Blog.findById(blogId)
        blog.updateOneReadCount()
        res.status(200).json({blog})
    } catch (error) {
        next(error);
    }
}

const createBlog = async (req, res, next) => {
    try {
        const exists = await Blog.find({title: req.body.title})
        if(exists.length > 0) {
            console.log(exists);
            return res.status(400).json({error: "Blog already exists"});
        }

        const tags = req.body.tags.trim("").split(",").filter(tag => tag !== "") // this cleans the tags and makes sure it's not an empty string
        const blogDetails = {...req.body, tags, author: req.user.id}
        const blog = await Blog.create(blogDetails);
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
}

const updateBlogState = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const state = req.body.state;

        if (!state) {
            return res.status(400).json({error: "No state was provided"})
        }
        // updating the blog this way instead of using findByIdAndUpdate will validate if the state is in the enum schema property values
        // using findByIdAndUpdate doesn't check if the state is a valid one (according to the schema enum) before updating the blog
        const blog = await Blog.findById(blogId);
        blog.state = state;
        await blog.save();
        res.status(200).json({blog})
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPublishedBlogs,
    getPublishedBlogById,
    createBlog,
    updateBlogState
}