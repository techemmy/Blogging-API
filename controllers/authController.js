const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.signup_post = (req, res, next) => {
    try {
        res.json({message: "Signup successful", user: req.user})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.login_post = (error, req, res, next, user, info) => {
    try {
        if (error || !user) {
            const error = info ? info: new Error("An error occurred in logging in user");
            return next(error);
        }
        const signedUser = {id: user._id, email: user.email};
        const token = jwt.sign({user: signedUser}, process.env.AUTH_SECRET, {expiresIn: '1h'})
        res.json({message: "Logged In Successfully", token})
    } catch (error) {
        console.log(error);
        next(error);
    }
}
