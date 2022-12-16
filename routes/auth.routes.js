const express = require("express");
const authController = require("../controllers/authController");
const passport = require("passport");
const {
    signupValidationMiddleware,
    loginValidationMiddleware,
} = require("../validators/auth.validator");

const router = express.Router();

/**
 *  @swagger
 *   components:
 *     schemas:
 *       Auth:
 *         type: object
 *         required:
 *           - email
 *           - firstName
 *           - lastName
 *           - password
 *         properties:
 *           id:
 *             type: integer
 *             description: The auto-generated id for a user.
 *           email:
 *             type: string
 *             description: The user's email
 *           firstName:
 *             type: string
 *             description: The user's first name
 *           lastName:
 *             type: string
 *             description: The user's last name
 *           password:
 *             type: string
 *             description: The user's password
 *         example:
 *            email: foobar@gmail.com
 *            firstName: Foo
 *            lastName: Bar
 *            password: foobar
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: API to manage your authentication.
 */

/**
 *  @swagger
 * paths:
 *   /signup:
 *     post:
 *       summary: Create a new user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auth'
 *       responses:
 *         "201":
 *           description: User created successfully
 *
 *   /login:
 *     post:
 *       summary: Log user in
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: 'object'
 *               properties:
 *                 email:
 *                   type: string
 *                   example: foobar@gmail.com
 *                 password:
 *                   type: string
 *                   example: foobar
 *       responses:
 *         "200":
 *           description: Logged in successfully
 */

router.post(
    "/signup",
    signupValidationMiddleware,
    passport.authenticate("signup", { session: false }),
    authController.signup_post
);

router.post("/login", loginValidationMiddleware, async (req, res, next) => {
    passport.authenticate("login", (error, user, info) => {
        try {
            authController.login_post(error, req, res, next, user, info);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
});

module.exports = router;
