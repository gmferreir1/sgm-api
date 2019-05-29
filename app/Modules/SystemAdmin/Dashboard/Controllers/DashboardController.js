"use strict";
const Env = use("Env");
const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);

const ControlUpdateModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/ControlUpdate`
);

const FluxAttendanceModel = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Models/FluxAttendance`
);

const ReasonModel = use(
  `${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`
);

class DashboardController {
  async metrics() {
    // usuários
    const count_users = await UserModel.query().count();
    const total_users = count_users[0]["count(*)"];

    // controle de atualizações
    const result_control_update = await ControlUpdateModel.query()
      .orderBy("created_at", "DESC")
      .first();

    // fluxo de atendimento
    const count_flux = await FluxAttendanceModel.query().count();
    const total_flux = count_flux[0]["count(*)"];

    // motivos
    const count_reason = await ReasonModel.query().count();
    const total_reason = count_reason[0]["count(*)"];


    return {
      total_users,
      last_update: !result_control_update
        ? null
        : result_control_update.created_at,
      total_flux,
      total_reason
    };
  }
}

module.exports = DashboardController;
