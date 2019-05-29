"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.get("check-email-exist", `${MODULE_PATH}/User/Controllers/UserController.queryEmailExists`);
}).prefix("admin/user/query").middleware("auth");

Route.group(() => {
  Route.post("", `${MODULE_PATH}/User/Controllers/UserController.create`).validator(`${MODULE_PATH}/User/Validators/Create`);
  Route.get("", `${MODULE_PATH}/User/Controllers/UserController.all`);
  Route.get("/:id", `${MODULE_PATH}/User/Controllers/UserController.find`);
  Route.put("/:id", `${MODULE_PATH}/User/Controllers/UserController.update`).validator(`${MODULE_PATH}/User/Validators/Update`);
}).prefix("admin/user").middleware("auth");
