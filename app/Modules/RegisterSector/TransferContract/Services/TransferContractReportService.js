"use strict";
const Env = use("Env");
const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);
const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);
const collect = use("collect.js");
const Promise = use("bluebird");

class TransferContractReportService {
  static async mountReportQt(transferData) {
    return {
      total: await this.total(transferData),
      per_user: await this.dataPerUser(transferData),
      reasons: await this.reasons(transferData)
    };
  }

  static async total(transferData) {
    const collection = collect(transferData);

    return {
      qt: collection.count(),
      value: collection.sum("value")
    };
  }

  static async dataPerUser(transferData) {
    const collection = collect(transferData);
    const users = collection
      .unique("responsible_transfer")
      .pluck("responsible_transfer")
      .all();
    const data = [];

    await Promise.each(users, async user => {
      const userData = await UserModel.query()
        .where("id", user)
        .first();
      const collectionUser = collection.where("responsible_transfer", user);

      data.push({
        name: userData.name,
        last_name: userData.last_name,
        qt: collectionUser.count(),
        value: collectionUser.sum("value"),
        percent: (
          (collectionUser.sum("value") / collection.sum("value")) *
          100
        ).toFixed(1)
      });
    });

    const collectionTotal = collect(data);
    return collectionTotal.sortBy("name").all();
  }

  /**
   * Retorna relatorio dos motivos
   * @param {*} transferData
   */
  static async reasons(transferData) {
    const collection = collect(transferData);
    const reasons = collection
      .unique("reason_id")
      .pluck("reason_id")
      .all();
    const data = [];

    await Promise.each(reasons, async reason => {
      const reasonData = await ReasonModel.query()
        .where({
          id: reason,
          module_name: "transfer_contract",
          type_reason: "transfer_contract"
        })
        .first();
      const collectionReason = collection.where("reason_id", reason);

      data.push({
        name: reasonData.reason,
        qt: collectionReason.count(),
        value: collectionReason.sum("value"),
        percent: (
          (collectionReason.sum("value") / collection.sum("value")) *
          100
        ).toFixed(1)
      });
    });

    const collectionTotal = collect(data);
    return collectionTotal.sortByDesc("qt").all();
  }
}

module.exports = TransferContractReportService;
