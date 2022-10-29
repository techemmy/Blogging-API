const express = require('express');
const authController = require("../controllers/authController")
const passport = require("passport");

const router = express.Router();

router.post("/signup", passport.authenticate('signup', {session: false}), authController.signup_post)

router.post("/login", authController.login_post)

module.exports = router;