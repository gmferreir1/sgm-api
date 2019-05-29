"use strict";

const fs = use("fs");
const view = use("View");
const Helpers = use("Helpers");
const Promise = use("bluebird");
const wkhtmltopdf = use("wkhtmltopdf");
const createReport = use('docx-templates');
use("App/Helpers/Edge");

class ServicePrinter {
  /**
   * Gera a impressão
   * @param {*} dataForPrint
   * @param {*} templatePath
   * @param {*} optionsPrint
   */
  static async generatePrint(dataForPrint, templatePath, optionsPrint = null) {

    const hash = "_" + Math.random().toString(36).substr(2, 9);
    const fileAndPath = Helpers.publicPath(hash + ".pdf");

    const optionsPrintDefault = {
      pageSize: "a4",
      dpi: 72,
      orientation: "landscape",
      "margin-top": 5,
      "margin-left": 5,
      "margin-right": 5
    };

    const options = !optionsPrint ? optionsPrintDefault : optionsPrint;

    return new Promise(function (resolve) {
      wkhtmltopdf(view.render(templatePath, dataForPrint), options, function (
        err,
        stream
      ) {
        if (err) throw err;

        return stream.pipe(
          fs.createWriteStream(fileAndPath, { encoding: "utf8" })
            .on("finish", () => {
              resolve({
                file_and_path: fileAndPath,
                file_name: hash + ".pdf"
              });
            })
        );
      });
    }).then(result => {
      return result;
    });
  }

  /**
   * Gera arquivo word
   * @param {*} data 
   * @param {*} template 
   * @param {*} destination 
   */
  static async generateWord(data, template, destination) {

    const hash = "_" + Math.random().toString(36).substr(2, 9);

    await createReport({
      template: template,
      output: `${destination}/${hash}.docx`,
      data,
      processLineBreaks: true
    });

    return {
      file_and_path: `${destination}/${hash}.docx`,
      file_name: hash + ".docx"
    }

  }
}

module.exports = ServicePrinter;
