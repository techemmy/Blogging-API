const express = require("express");
const authController = require("../controllers/blogController");


const router = express.Router();

router.get("/", authController.getAllPublishedBlogs);
router.get("/:id", authController.getPublishedBlogById);

module.exports = router;