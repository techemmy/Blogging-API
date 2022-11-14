const express = require("express");
const passport = require("passport");
const authController = require("../controllers/blogController");

const router = express.Router();

/**
 *  @swagger
 *   components:
 *     schemas:
 *       Blog:
 *         type: object
 *         required:
 *           - title
 *           - body
 *           - author
 *           - state
 *         properties:
 *           id:
 *             type: integer
 *             description: The auto-generated id of the blog.
 *           title:
 *             type: string
 *             description: The title of your blog.
 *           description:
 *             type: string
 *             description: The description of your blog.
 *           body:
 *             type: string
 *             description: The body of your blog.
 *           author:
 *             type: string
 *             description: Who wrote the blog?
 *           state:
 *             type: string
 *             enum: ["draft", "published"]
 *             description: Is the blog in drafts or published?
 *           read_count:
 *             type: number
 *             description: The amount of time the blog has been read
 *           reading_time:
 *             type: object
 *             description: How long would it take to read the blog?
 *             properties:
 *               inString:
 *                    type: string
 *                    description: auto-generated time it would take to read blog in strings as minutes and seconds
 *               inNumber:
 *                    type: number
 *                    description: auto-generated time it would take to read blog in number seconds
 *           tags:
 *             type: array
 *             description: The blog tags
 *           createdAt:
 *             type: string
 *             format: date
 *             description: The auto-generated date of the record creation.
 *           updatedAt:
 *             type: string
 *             format: date
 *             description: The auto-generated date of the record update.
 *         example:
 *            title: G.O.A.T
 *            description: Becoming the GOAT 🐐
 *            body: He he! Are you sure?
 *            tags: goat,football
 */

/**
 *  @swagger
 *  tags:
 *    name: Blogs
 *    description: API to manage your blogs.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: https
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 *  @swagger
 * paths:
 *   /:
 *     get:
 *       summary: Gets all published books
 *       tags: [Blogs]
 *       responses:
 *         "200":
 *           description: The published books
 *     post:
 *       security:
 *         - bearerAuth: []
 *       summary: Create a new blog
 *       tags: [Blogs]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       responses:
 *         "201":
 *           description: Blog created successfully
 *
 *   /mine:
 *     get:
 *       security:
 *         - bearerAuth: []
 *       summary: Gets current logged in user blogs
 *       tags: [Blogs]
 *       responses:
 *         "200":
 *           description: Current user blogs
 *
 *   /publish/{id}:
 *     patch:
 *       security:
 *         - bearerAuth: []
 *       summary: Change blog state to published
 *       tags: [Blogs]
 *       parameters:
 *         - in: path
 *           name: id
 *           description: ID of blog to publish
 *           type: string
 *           required: true
 *       responses:
 *         "200":
 *           description: Blog published successfully
 *
 *   /{blogId}:
 *     put:
 *       security:
 *         - bearerAuth: []
 *       summary: Edit a blog
 *       tags: [Blogs]
 *       parameters:
 *         - in: path
 *           name: blogId
 *           description: ID of blog to edit
 *           type: string
 *           required: true
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       responses:
 *         "200":
 *           description: Blog edited successfully
 *
 *   /{blogID}:
 *     delete:
 *       security:
 *         - bearerAuth: []
 *       summary: Delete a blog
 *       tags: [Blogs]
 *       parameters:
 *         - in: path
 *           name: blogID
 *           description: ID of blog to delete
 *           type: string
 *           required: true
 *       responses:
 *         "200":
 *           description: Blog deleted successfully
 */

router.get("/", authController.getAllPublishedBlogs_get);
router.get(
    "/mine",
    passport.authenticate("jwt", { session: false }),
    authController.getUserBlogs_get
);
router.get("/:id", authController.getPublishedBlogById_get);
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authController.createBlog_post
);
router.patch(
    "/publish/:id",
    passport.authenticate("jwt", { session: false }),
    authController.updateBlogToPublish_patch
);
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    authController.editBlog_put
);
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    authController.deleteBlog_delete
);

module.exports = router;
