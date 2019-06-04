"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.post("", `${MODULE_PATH}/FluxAttendance/Controllers/FluxAttendanceController.create`).validator(`${MODULE_PATH}/FluxAttendance/Validators/Create`);
  Route.put("/:id", `${MODULE_PATH}/FluxAttendance/Controllers/FluxAttendanceController.update`).validator(`${MODULE_PATH}/FluxAttendance/Validators/Update`);
  Route.get("", `${MODULE_PATH}/FluxAttendance/Controllers/FluxAttendanceController.all`);
  Route.delete("/:id", `${MODULE_PATH}/FluxAttendance/Controllers/FluxAttendanceController.delete`);
  Route.get("get-next-attendance", `${MODULE_PATH}/FluxAttendance/Controllers/FluxAttendanceController.getNextAttendance`);
}).prefix("admin/flux-attendance").middleware("auth");
