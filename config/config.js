const swaggerJsdoc = require("swagger-jsdoc");
const rateLimit = require("express-rate-limit");
const MongoStore = require('connect-mongo');

const API_PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blogging API - Emmanuel Oloyede",
            version: "0.1.0",
            description:
                "This is a simple API application made with Express and documented with Swagger",
            contact: {
                name: "TechEmmy",
                url: "https://github.com/techemmy",
                email: process.env.EMAIL_ADDRESS,
            },
        },
        servers: [
            {
                url: "https://blogging-api.onrender.com/auth",
            },
            {
                url: "http://localhost:8000/auth",
            },
            {
                url: "https://blogging-api.onrender.com/blogs",
            },
            {
                url: "http://localhost:8000/blogs",
            },
        ],
    },
    apis: ["./routes/auth.routes.js", "./routes/blog.routes.js"],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authOConfig = {
    issuer: 'https://' + process.env.AUTH0_DOMAIN + '/',
    authorizationURL: 'https://' + process.env.AUTH0_DOMAIN + '/authorize',
    tokenURL: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
    userInfoURL: 'https://' + process.env.AUTH0_DOMAIN + '/userinfo',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: '/auth/oauth2/redirect',
    scope: [ 'openid', 'profile', 'email' ]
}

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
    store: MongoStore.create({mongoUrl: process.env.DB_URI})
}

module.exports = { swaggerSpecs, API_PORT, DB_URI, apiLimiter, authOConfig, sessionConfig };
