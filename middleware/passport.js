const passport = require("passport");
const User = require("../models/user");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const OpenIDConnectStrategy = require('passport-openidconnect');
const { authOConfig } = require("../config/config");
require("dotenv").config();

passport.use(
	"signup",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				const { firstName, lastName } = req.body;
				const exists = await User.findOne({ email });
				if (exists) {
					return done(null, false, {
						message: "User already exists",
					});
				}
				const user = await User.create({
					firstName,
					lastName,
					email,
					password,
				});
				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	"login",
	new localStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false, { message: "User not found" });
				}

				if (!(await user.isValidPassword(password))) {
					return done(null, false, {
						message: "Invalid login details",
					});
				}

				done(null, user, { message: "Logged in successfully" });
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			secretOrKey: process.env.AUTH_SECRET,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(new OpenIDConnectStrategy(authOConfig,
  async function verify(issuer, profile, done) {
	let userObj = {}
	const email = profile.emails[0].value || profile.displayName;
	const user = await User.findOne({ email });

	if (!user) {
		if (profile.displayName && profile.displayName !== email) {
			const {familyName: firstName, givenName: lastName} = profile.name;
			userObj = {firstName, lastName, email};
		} else {
			userObj = {firstName: ' ', lastName: ' ', email}
		}
		userObj.oauth = true;
		const user = await User.create(userObj)
		return done(null, user)
	}

	return done(null, user, {
		message: "User already exists",
	});
  })
)

passport.serializeUser(function(user, cb) {
	cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
  });