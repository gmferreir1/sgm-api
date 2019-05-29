"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("AUTH_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.post("authenticate", `${MODULE_PATH}/Controllers/AuthController.authenticate`).validator(`${MODULE_PATH}/Validators/Login`);
  Route.get("get-data-user", `${MODULE_PATH}/Controllers/AuthController.dataUserLogged`).middleware("auth");
}).prefix("login");
