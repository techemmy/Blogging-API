const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
require("dotenv").config()

passport.use(
    new JWTStrategy({
        secretOrKey: process.env.AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (token, done) => {
        try {
            return
        } catch (error) {
            console.log(error);
            done(error);
        }
    })
)
