"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("FINANCE_MODULE");
const Route = use("Route");

/** Rota de consultas do modulo */
Route.group(() => {
  Route.get("", `${MODULE_PATH}/ContractCelebrated/Controllers/ContractCelebratedController.all`);
  Route.get("/:id", `${MODULE_PATH}/ContractCelebrated/Controllers/ContractCelebratedController.find`);
  Route.put("/:id", `${MODULE_PATH}/ContractCelebrated/Controllers/ContractCelebratedController.update`);
  Route.put("update-multiple/status", `${MODULE_PATH}/ContractCelebrated/Controllers/ContractCelebratedController.updateMultipleStatus`);
})
  .prefix("finance/contract-celebrated")
  .middleware("auth");