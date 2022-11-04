const jwt = require("jsonwebtoken");
require("dotenv").config()

const signup_post = (req, res, next) => {
    try {
        res.status(201).json({message: "Signup successful", user: req.user})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const login_post = (error, req, res, next, user, info) => {
    try {
        if (error || !user) {
            const error = info ? info: "An error occurred in logging in user";
            return res.status(400).json({status:false, error})
        }
        const signedUser = {id: user._id, email: user.email};
        const token = jwt.sign({user: signedUser}, process.env.AUTH_SECRET, {expiresIn: '1h'})
        res.json({message: "Logged In Successfully", token})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    signup_post,
    login_post
}