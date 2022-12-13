var winston = require('winston');
var config = require('config');
var moment = require('moment');
var logLevel = config.get('log.level');
var logger;

var createLogger = function createLogger() {
  "use strict";
  if (logger) {
    return logger;
  }
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: logLevel,
        timestamp: function () {
          return moment().format();
        },
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });
  logger.stream = {
    write: function (message, encoding) {
      message = message.replace(/\n$/, ''); //remove the trailing newline, since it will be added by logger anyway
      logger.info(message);
    }
  };
  return logger;
};

module.exports = createLogger;
