"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("REGISTER_SECTOR_MODULE");
const Route = use("Route");


/** Rotas da tansferência */
Route.group(() => {
  Route.post("", `${MODULE_PATH}/TransferContract/Controllers/TransferContractController.create`)
    .validator(`${MODULE_PATH}/TransferContract/Validators/Create`);
  Route.put("/:id", `${MODULE_PATH}/TransferContract/Controllers/TransferContractController.update`)
    .validator(`${MODULE_PATH}/TransferContract/Validators/Create`);
  Route.get("", `${MODULE_PATH}/TransferContract/Controllers/TransferContractController.all`);
  Route.get("/:id", `${MODULE_PATH}/TransferContract/Controllers/TransferContractController.find`);
  Route.put("/:id/cancel-transfer", `${MODULE_PATH}/TransferContract/Controllers/TransferContractController.cancelTransfer`);
}).prefix("register-sector/transfer-contract").middleware("auth");


/** Rotas historico da tansferência */
Route.group(() => {
  Route.post("", `${MODULE_PATH}/TransferContract/Controllers/TransferHistoricController.create`)
    .validator(`${MODULE_PATH}/TransferContract/Validators/CreateHistoric`);
  Route.get("/:id_register", `${MODULE_PATH}/TransferContract/Controllers/TransferHistoricController.all`);
}).prefix("register-sector/transfer-contract/historic").middleware("auth");

