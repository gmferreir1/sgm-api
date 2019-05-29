"use strict";

const { ServiceProvider } = require("@adonisjs/fold");

class MessageProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const Response = use("Adonis/Src/Response");
    Response.macro("dispatch", function(statusCode, message = null) {
      this.status(statusCode).json([{ message: message }]);
    });
  }
}

module.exports = MessageProvider;
