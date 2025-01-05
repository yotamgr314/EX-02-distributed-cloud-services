const { createLogger, format, transports } = require("winston");
const path = require("path");

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
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
  ],
});

const logError = (message) => {
  logger.error(message);
};

module.exports = { logError };
