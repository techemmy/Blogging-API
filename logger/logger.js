const winston = require("winston");
const json = require("morgan-json");
const morgan = require("morgan");

const options = {
    file: {
        level: "info",
        filename: "./logs/app.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
    ],
    exitOnError: false,
});

// if (process.env.NODE_ENV !== "production") {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple(),
//         })
//     );
// }

const morganLoggerConfig = json({
    method: ":method",
    url: ":url",
    status: ":status",
    contentLength: ":res[content-length]",
    responseTime: ":response-time",
});

const httpLogger = morgan(morganLoggerConfig, {
    stream: {
        write: (message) => {
            const { method, url, status, contentLength, responseTime } =
                JSON.parse(message);

            logger.info("HTTP Access Log", {
                timestamp: new Date().toString(),
                method,
                url,
                status: Number(status),
                contentLength,
                responseTime: Number(responseTime),
            });
        },
    },
});

module.exports = { httpLogger }