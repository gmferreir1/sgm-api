"use strict";

const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");

const Route = use("Route");

Route.group(() => {
  Route.get("", `${MODULE_PATH}/SystemAction/Controllers/SystemActionController.all`);
}).prefix("admin/system-action").middleware("auth");
