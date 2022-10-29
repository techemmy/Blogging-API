exports.signup_post = (req, res, next) => {
    try {
        res.json({message: "signup"})
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
