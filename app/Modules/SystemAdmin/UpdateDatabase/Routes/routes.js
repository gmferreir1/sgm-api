"use strict";

const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.get("", `${MODULE_PATH}/UpdateDatabase/Controllers/UpdateDatabaseController.updateDatabase`);
  Route.post("file-upload", `${MODULE_PATH}/UpdateDatabase/Controllers/UpdateDatabaseController.fileUpload`);
})
  .prefix("admin/update-database")
  .middleware("auth");
