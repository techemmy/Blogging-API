const express = require('express');
const authController = require("../controllers/authController")
const passport = require("passport");

const router = express.Router();

router.post("/signup", passport.authenticate('signup', {session: false}), authController.signup_post)

router.post("/login", async (req, res, next) => {
    passport.authenticate('login', {failureRedirect: '/sike'}, (error, user, info) => {
        try {
            if (error || !user) {
                const error = new Error("An error occurred in logging in user");
                next(error);
            }
            authController.login_post(req, res, next, user, info);
        } catch (error) {
            next(error);
        }
    })(req, res, next)
})

module.exports = router;