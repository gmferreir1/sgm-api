"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.get("metrics", `${MODULE_PATH}/Dashboard/Controllers/DashboardController.metrics`);
}).prefix("admin/dashboard").middleware("auth");
