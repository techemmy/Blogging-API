const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();
app.disable('x-powered-by')

app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())
require("./middleware")

app.get("/", (req, res) => {
    res.status(200).json({message: "Homepage"})
})

// error Handler middleware
app.use((error, req, res, next) => {
    try {
        res.status(error.status || 500).json({error})
    } catch (error) {
        console.log(error);
    }
})


module.exports = app;