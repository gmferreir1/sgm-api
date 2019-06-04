"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("API_EXTERNAL_MODULE");
const Route = use("Route");

/** Rota de consultas do modulo */
Route.group(() => {
  Route.get("immobile-data", `${MODULE_PATH}/Controllers/ImoviewAPIDataController.getImmobileData`);
  Route.get("client-data", `${MODULE_PATH}/Controllers/ImoviewAPIDataController.getClientData`);
})
  .prefix("api-query")
  .middleware("auth");