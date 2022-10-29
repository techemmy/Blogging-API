const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.disable('x-powered-by')

app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.urlencoded({extended: true}))
require("./middleware")

app.get("/", (req, res) => {
    res.status(200).json({message: "Homepage"})
})

app.use("/auth", authRoutes);

app.use((req, res, next) => {
    try {
        res.status(404).json({error: "Route doesn't exist!"})
    } catch (error) {
        next(error);
    }
})

// error Handler middleware
app.use((error, req, res, next) => {
    try {
        res.status(error.status || 500).json({error: error.message})
    } catch (error) {
        console.log(error);
    }
})


module.exports = app;