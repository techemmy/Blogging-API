exports.signup_post = (req, res, next) => {
    try {
        res.json({message: "Signup successful", user: req.user})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.login_post = (req, res, next, user, info) => {
    try {
        console.log(user, info);
        res.json({message: "Logged In Successfully"})
    } catch (error) {
        console.log(error);
        next(error);
    }
}
