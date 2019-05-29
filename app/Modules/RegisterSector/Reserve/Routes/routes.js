"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("REGISTER_SECTOR_MODULE");
const Route = use("Route");

/** Rota de consultas do modulo */
Route.group(() => {
  Route.get("types-immobile", `${MODULE_PATH}/Reserve/Controllers/QueryController.getTypesImmobile`);
  Route.get("immobile", `${MODULE_PATH}/Reserve/Controllers/QueryController.getImmobileData`);
  Route.get("client", `${MODULE_PATH}/Reserve/Controllers/QueryController.getClientData`);
  Route.get("reasons-cancel", `${MODULE_PATH}/Reserve/Controllers/QueryController.getReasonsCancel`);
  Route.get("attendants-for-filter", `${MODULE_PATH}/Reserve/Controllers/QueryController.getAttendandtsForFilter`);
  Route.get("get-years-available-to-report", `${MODULE_PATH}/Reserve/Controllers/QueryController.getYearsAvailableToReport`);
  Route.get("score", `${MODULE_PATH}/Reserve/Controllers/QueryController.getModuleScore`);
})
  .prefix("register-sector/reserve/query")
  .middleware("auth");

/** Rotas da reserva */
Route.group(() => {
  Route.post("", `${MODULE_PATH}/Reserve/Controllers/ReserveController.create`).validator(`${MODULE_PATH}/Reserve/Validators/Create`);
  Route.get("/:id", `${MODULE_PATH}/Reserve/Controllers/ReserveController.find`);
  Route.get("", `${MODULE_PATH}/Reserve/Controllers/ReserveController.all`);
  Route.put("/:id", `${MODULE_PATH}/Reserve/Controllers/ReserveController.update`).validator(`${MODULE_PATH}/Reserve/Validators/Update`);
  Route.put("/:id/cancel-reserve", `${MODULE_PATH}/Reserve/Controllers/ReserveController.cancelReserve`);
  Route.get("printer/report", `${MODULE_PATH}/Reserve/Controllers/PrinterReportController.printerReport`);
}).prefix("register-sector/reserve").middleware("auth");



/** Rotas historicos da reserva */
Route.group(() => {
  Route.get("/:reserve_id", `${MODULE_PATH}/Reserve/Controllers/ReserveHistoricController.all`);
  Route.post("", `${MODULE_PATH}/Reserve/Controllers/ReserveHistoricController.create`).validator(`${MODULE_PATH}/Reserve/Validators/CreateHistoric`);
}).prefix("register-sector/reserve/historic").middleware("auth");