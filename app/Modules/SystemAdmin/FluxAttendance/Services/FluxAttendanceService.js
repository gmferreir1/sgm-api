"use srict";
const Env = use("Env");
const Logger = use("App/Helpers/Logger");

const FluxAttendanceModel = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Models/FluxAttendance`
);
const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);

class FluxAttendanceService {
  /**
   * Retorna o proximo atentende de acordo com o modulo passado
   * @param {String} module_name
   * @param {Object} auth
   */
  static async getNextAttendance(module_name, auth) {
    if (!auth) {
      return false;
    }

    const flux = await FluxAttendanceModel.query()
      .where({ module_name })
      .orderBy("score", "ASC")
      .first();

    if (!flux) {
      return this.getUserData(auth.user.id);
    }

    return this.getUserData(flux.user);
  }

  /**
   * Adiciona score de atendimento ao usuário
   * @param {*} module_name
   * @param {*} user_id
   * @param {*} auth
   */
  static async addScore(module_name, user_id, auth) {
    const flux = await FluxAttendanceModel.query()
      .where({ module_name, user: user_id })
      .first();

    if (!flux) {
      try {
        await FluxAttendanceModel.create({
          user: user_id,
          score: 1,
          module_name,
          rp_last_action: auth.user.id
        });

        return true;
      } catch (error) {
        Logger.create(error);
        return false;
      }
    } else {
      try {
        let scoreFlux = flux.score;
        await FluxAttendanceModel.query()
          .where({ module_name, user: user_id })
          .update({
            score: scoreFlux + 1
          });

        return true;
      } catch (error) {
        Logger.create(error);
        return false;
      }
    }
  }

  /**
   * Retorna os dados do usuário
   * @param {*} userId
   */
  static async getUserData(userId) {
    const userData = await UserModel.query()
      .where({ id: userId })
      .first();

    return {
      name: `${userData.name} ${userData.last_name}`,
      id: userData.id
    };
  }
}

module.exports = FluxAttendanceService;
