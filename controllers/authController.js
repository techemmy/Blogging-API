exports.signup_post = (req, res, next) => {
    try {
        res.json({message: "Signup successful", user: req.user})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.login_post = (req, res, next) => {
    try {
        res.json({message: "login"})
    } catch (error) {
        console.log(error);
        next(error);
    }
}
