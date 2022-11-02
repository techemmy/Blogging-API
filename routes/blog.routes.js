const express = require("express");
const authController = require("../controllers/blogController");


router = express.Router();

router.get("/", authController.getAllPublishedBlogs);
router.get("/:id", authController.getPublishedBlogById);

module.exports = router;