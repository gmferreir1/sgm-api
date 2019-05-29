"use strict";
const fs = use("fs");
const http = use("axios");
const { toLowerCase } = use("App/Helpers/String");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

require("../app/Modules/Auth/Routes/routes");
require("../app/Modules/SystemAdmin/User/Routes/routes");
require("../app/Modules/SystemAdmin/Dashboard/Routes/routes");
require("../app/Modules/SystemAdmin/UpdateDatabase/Routes/routes");
require("../app/Modules/SystemAdmin/FluxAttendance/Routes/routes");
require("../app/Modules/SystemAdmin/Reason/Routes/routes");
require("../app/Modules/SystemAdmin/LetterAndDocuments/Routes/routes");
require("../app/Modules/RegisterSector/Reserve/Routes/routes");

Route.get("/", () => {
  return { result: "API SGM" };
});

/** Consulta dados do imovel pelo CEP */
Route.get("query-zip-code", async ({ request, response }) => {
  const requestData = request.all();
  const zipCode = requestData.zip_code.replace(/^\D+/g, "");

  return await http
    .get(`https://viacep.com.br/ws/${zipCode}/json/`)
    .then(result => {
      if (result.data.erro) {
        return response.dispatch(
          400,
          "Endereço não localizado com o CEP informado"
        );
      }
      return toLowerCase(result.data);
    })
    .catch(err => {
      if (err.response.status === 400) {
        return response.dispatch(400, "Erro ao consultar API CEP");
      }
    });
}).middleware("auth");

Route.get("delete-file", ({ request }) => {
  fs.unlink(request.all().file_and_path, function(err) {
    if (err) throw err;
  });
}).middleware("auth");

Route.get("/:param", ({ params, response }) => {
  return response.download(`public/${params.param}`);
});
