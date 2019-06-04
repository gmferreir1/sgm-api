"use strict";

const Env = use("Env");
const xlsx = use("node-xlsx");
const Promise = use("bluebird");
const Logger = use("App/Helpers/Logger");
const { toLowerCase } = use("App/Helpers/String");

const ImmobileModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/Immobile`
);

const TypeImmobileModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/TypeImmobile`
);

class UpdateDatabaseService {
  static async readExcelFile(path) {
    const workSheetsFromFile = xlsx.parse(path);

    await ImmobileModel.truncate();

    return Promise.each(workSheetsFromFile[0].data, async (data, index) => {
      if (index > 0) {
        const data_ = toLowerCase(data);

        const typeImmobileData = await TypeImmobileModel.query()
          .where({ name: data_[6].toLowerCase() })
          .first();

        let address;

        if (data_[31] != undefined) {
          address = `${data_[29]} ${data_[30]}, ${data_[31]}`;
        } else {
          address = data_[30] ? `${data_[29]} ${data_[30]}` : `${data_[29]}`;
        }

        const dataToCreate = {
          immobile_code: data_[0],
          immobile_code_extra: data_[1],
          type_location: data_[2] === "residencial" ? "r" : "c",
          immobile_type: typeImmobileData ? typeImmobileData.value : null,
          indicator_key: !data[10] ? null : data[10],
          number_keys: !data[11] ? null : data[11],
          number_controls: !data[12] ? null : data[12],
          value_rent: data[20],
          value_condominium: !data[21] ? null : data[21],
          value_iptu: !data[22] ? null : data[22],
          index_iptu: !data[23] ? null : data[23],
          tx_administration: !data[25]
            ? null
            : parseInt(data[25].replace(/\D/g, "")),
          tx_intermediation: !data[26]
            ? null
            : parseInt(data[26].replace(/\D/g, "")),
          zip_code: !data[28] ? null : data[28].replace(/\D/g, ""),
          address: address,
          neighborhood: data[33],
          city: data[35],
          state: data[36]
        };

        await ImmobileModel.create(dataToCreate);

        return {
          sucess: true
        };
      }
    }).catch(err => {
      Logger.create(err);
      return {
        error: true
      };
    });
  }
}

module.exports = UpdateDatabaseService;
