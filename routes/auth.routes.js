const express = require('express');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    try {
        res.json({message: "signup"})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post("/login", (req, res, next) => {
    try {
        res.json({message: "login"})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;