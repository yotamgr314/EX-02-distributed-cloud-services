const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

const logError = (message) => {
  logger.error(message);
};

module.exports = { logError };
