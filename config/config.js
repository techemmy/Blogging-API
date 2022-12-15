const swaggerJsdoc = require("swagger-jsdoc");

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

module.exports = { swaggerSpecs };
