"use strict";
const Env = use("Env");
const MODULE_PATH = Env.get("ADMIN_MODULE");
const Route = use("Route");

Route.group(() => {
  Route.get("letter-text", `${MODULE_PATH}/LetterAndDocuments/Controllers/LetterAndDocumentsController.getTextLetter`);
  Route.put("letter-text", `${MODULE_PATH}/LetterAndDocuments/Controllers/LetterAndDocumentsController.updateTextLetter`);
  Route.delete("letter-text", `${MODULE_PATH}/LetterAndDocuments/Controllers/LetterAndDocumentsController.setDefaultTextLetter`);
})
  .prefix("admin/letter-and-documents")
  .middleware("auth");
