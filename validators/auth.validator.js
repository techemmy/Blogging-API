const Joi = require("joi");

const signupDataValidator = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
});

const loginDataValidation = Joi.object({
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
        })
        .required(),
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
});

const signupValidationMiddleware = async (req, res, next) => {
    try {
        const value = await signupDataValidator.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(406).send(error.details[0].message);
    }
};

const loginValidationMiddleware = async (req, res, next) => {
    try {
        const value = await loginDataValidation.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(406).send(error.details[0].message);
    }
};

module.exports = { signupValidationMiddleware, loginValidationMiddleware };
