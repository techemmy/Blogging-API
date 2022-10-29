const passport = require("passport");
const User = require("../models/user");
const localStrategy = require("passport-local").Strategy
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
require("dotenv").config()


passport.use('signup',
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const {firstName, lastName} = req.body
            const user = await User.create({ firstName, lastName, email, password})
            return done(null, user)
        } catch (error) {
            console.log(error);
            done(error);
        }
    })
)

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
