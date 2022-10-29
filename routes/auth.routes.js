const express = require('express');

const router = express.Router();

router.get("/signup", (req, res, next) => {
    try {
        res.json({message: "signup"})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.get("/login", (req, res, next) => {
    try {
        res.json({message: "login"})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;