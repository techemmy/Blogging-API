const {Blog, blogStates} = require("../models/blog");
const { isValidObjectId } = require("../utils");

const getAllPublishedBlogs_get = async (req, res, next) => {
    try {
        const blogs = await Blog.find({state: blogStates.published})
        res.status(200).json({status: true, blogs})
    } catch (error) {
        next(error);
    }
}

const getPublishedBlogById_get = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        if (!isValidObjectId(blogId)) {
            return res.status(400).json({error: "Invalid blog id"})
        }

        const blog = await Blog.findById(blogId)
        if (!blog) return res.status(400).json({error: "Blog doesn't exists"})

        blog.updateOneReadCount()
        res.status(200).json({status: true, blog})
    } catch (error) {
        next(error);
    }
}

const createBlog_post = async (req, res, next) => {
    try {
        const exists = await Blog.find({title: req.body.title})
        if(exists.length > 0) {
            return res.status(400).json({error: "Blog already exists"});
        }

        const blogDetails = {...req.body, author: req.user.id}
        const blog = await Blog.create(blogDetails);
        res.status(201).json({status: true, blog});
    } catch (error) {
        next(error);
    }
}

const updateBlogToPublish_patch = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        if (!isValidObjectId(blogId)) {
            return res.status(400).json({error: "Invalid blog id"})
        }

        // using findByIdAndUpdate doesn't check if the state is a valid one (according to the schema enum) before updating the blog
        // updating the blog using the method below instead of using findByIdAndUpdate will validate if the state is in the enum schema property values
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(400).json({error: "Blog doesn't exists"})

        if (!blog.author.equals(req.user.id)) {
            return res.status(403).json({error: "This blog doesn't belong to you. You can only update your blog."})
        }

        if (blog.state === blogStates.published) return res.status(400).json({error: "Blog has been published!"})

        blog.state = blogStates.published;
        await blog.save();

        res.status(200).json({status: true, blog})
    } catch (error) {
        next(error);
    }
}

const editBlog_put = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const {title, description, body, tags} = req.body

        if (!isValidObjectId(blogId)) {
            return res.status(400).json({error: "Invalid blog id"})
        }

        if (await Blog.findOne({title})) return res.status(403).json({error: "Blog title has been taken!"})

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(400).json({error: "Blog doesn't exists"})

        if (!blog.author.equals(req.user.id)) {
            return res.status(403).json({error: "This blog doesn't belong to you. You can only update your blog."})
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.body = body || blog.body;
        blog.tags = tags || blog.tags;
        await blog.save();
        res.status(200).json({status: true, blog})

    } catch (error) {
        next(error);
    }
}

const deleteBlog_post = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        if (!isValidObjectId(blogId)) {
            return res.status(400).json({error: "Invalid blog id"})
        }

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(400).json({error: "Blog doesn't exists"})
        if (!blog.author.equals(req.user.id)) {
            return res.status(403).json({error: "This blog doesn't belong to you. You can only update your blog."})
        }
        await Blog.findByIdAndDelete(blogId);
        res.status(200).json({status: true, message: "Blog deleted successfully"})
    } catch (error) {
        next(error);
    }
}

const myBlogs_get = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const BLOGS_PER_PAGE = 10
        if (page < 1) return res.status(404).json({error: "Page not found"})
        const blogs = await Blog.find({author: req.user.id}).limit(BLOGS_PER_PAGE).skip((page - 1)*BLOGS_PER_PAGE);
        res.status(200).json({status: true, blogs})
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllPublishedBlogs_get,
    getPublishedBlogById_get,
    createBlog_post,
    updateBlogToPublish_patch,
    editBlog_put,
    deleteBlog_post,
    myBlogs_get
}