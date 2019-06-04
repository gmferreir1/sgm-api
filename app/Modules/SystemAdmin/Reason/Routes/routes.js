"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.post("", `${MODULE_PATH}/Reason/Controllers/ReasonController.create`).validator(`${MODULE_PATH}/Reason/Validators/Create`);
  Route.put("/:id", `${MODULE_PATH}/Reason/Controllers/ReasonController.update`).validator(`${MODULE_PATH}/Reason/Validators/Update`);
  Route.get("", `${MODULE_PATH}/Reason/Controllers/ReasonController.all`);
  Route.get("per-module", `${MODULE_PATH}/Reason/Controllers/ReasonController.getReasonsPerModule`);
})
  .prefix("admin/reason")
  .middleware("auth");
