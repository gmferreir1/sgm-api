"use strict";
const Log = use("Logger");
const moment = use("moment");

class Logger {

  static create(err) {

    Log
    .transport('file')
    .info(`${moment().format("DD/MM/YYYY HH:mm:ss")}: ${err}`);

  }
}

module.exports = Logger;