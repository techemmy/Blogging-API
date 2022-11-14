const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");

const app = express();
const options = {
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
                url: "http://localhost:8000/auth",
            },
            {
                url: "http://localhost:8000/blogs",
            },
        ],
    },
    apis: [ "./routes/auth.routes.js", "./routes/blog.routes.js"],
};
const specs = swaggerJsdoc(options);

app.use(cors());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./middleware");

app.get("/", (req, res) => {
    res.status(200).json({ message: "Homepage" });
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
