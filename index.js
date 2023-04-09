const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
const { swaggerSpecs, apiLimiter, sessionConfig } = require("./config/config");
const { httpLogger } = require("./logger/logger");
const session = require("express-session");
const passport = require("passport");
const jwt = require('jsonwebtoken')

const app = express();

app.use(cors());
app.use(httpLogger)
app.use(apiLimiter);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, { explorer: true })
);
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./middleware");

app.get("/", (req, res) => {
    if (!req.user) return res.status(200).json({ message: "Homepage" });

    // the section below works for OAuth Users
    const userHasNames = req.user && req.user.firstName.trim() && req.user.lastName.trim();
    let user;

    if (!userHasNames)
       user = req.user.email;
    if (userHasNames) {
        user = `${req.user.firstName} ${req.user.lastName} - @${req.user.email}`;
    }

    const signedUser = { id: req.user._id, email: req.user.email };
		const token = jwt.sign({ user: signedUser }, process.env.AUTH_SECRET, {
			expiresIn: "1h",
		});
    res.json({ message: "Logged In Successfully", user, token });
});

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

app.use((req, res, next) => {
    try {
        res.status(404).json({ error: "Route doesn't exist!" });
    } catch (error) {
        next(error);
    }
});

// error Handler middleware
app.use((error, req, res, next) => {
    try {
        if (error.name === "ValidationError") {
            //  sets status code for mongoose validation error
            error.status = 400;
        }
        res.status(error.status || 500).json({ error: error.message });
    } catch (error) {
        console.log(error);
    }
});

module.exports = app;
