const express = require("express");
const passport = require("passport");
const authController = require("../controllers/blogController");


const router = express.Router();

router.get("/", authController.getAllPublishedBlogs_get);
router.post("/", passport.authenticate('jwt', {session: false}), authController.createBlog_post);
router.get("/:id", authController.getPublishedBlogById_get);
router.patch("/state/:id", passport.authenticate('jwt', {session: false}), authController.updateBlogToPublish_patch);
router.put("/:id", passport.authenticate('jwt', {session: false}), authController.editBlog_put);

module.exports = router;