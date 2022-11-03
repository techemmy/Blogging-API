const express = require("express");
const passport = require("passport");
const authController = require("../controllers/blogController");


const router = express.Router();

router.get("/", authController.getAllPublishedBlogs);
router.post("/", passport.authenticate('jwt', {session: false}), authController.createBlog);
router.get("/:id", authController.getPublishedBlogById);
router.patch("/state/:id", passport.authenticate('jwt', {session: false}), authController.updateBlogToPublish);
router.put("/:id", passport.authenticate('jwt', {session: false}), authController.editBlog);

module.exports = router;