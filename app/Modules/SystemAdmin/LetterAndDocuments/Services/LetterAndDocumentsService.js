"use strict";

const Env = use("Env");
const LetterModel = use(`${Env.get("ADMIN_MODULE")}/LetterAndDocuments/Models/Letter`);

class LetterAndDocumentsService {
  /**
   * Texto da carta para notificação do proprietário da nova locação
   */
  static async ownerNewLocationText(type_letter) {
    /** verifica se existe texto gravado na base de dados */
    const checkText = await LetterModel.query().where({ type_letter }).first();
    if (checkText) {
      return checkText.text;
    }
    return this.getDefaultText(type_letter);
  }

  /**
   * Retorna o texto padrão do sistema
   * @param {*} typeDocument
   */
  static getDefaultText(type_letter) {
    let text = null;

    if (type_letter === "owner_notification_new_location") {
      text = `<p>Ilmo(a) Sr.(a)</p><p>
      @@_NOME_PROPRIETARIO
      </p><p><br></p><p>      @@_ENDERECO_PROPRIETARIO, @@_BAIRRO_PROPRIETARIO, @@_CIDADE_PROPRIETARIO - @@_ESTADO_PROPRIETARIO - CEP @@_CEP_PROPRIETARIO</p><p><br></p><p>
      Prezado Cliente,</p><p>
      Pela presente, vimos informar a V. Sa. dados do Contrato de Locação recentemente firmado, de imóvel de sua propriedade, por nós administrado.</p><p>
      CONTRATO LOCAÇÃO: @@_CONTRATO</p><p><br></p><p>      ENDEREÇO DO IMÓVEL: @@_ENDERECO_IMOVEL, @@_BAIRRO_IMOVEL - @@_CEP - @@_CIDADE - @@_ESTADO</p><p>      </p><p>      VALOR MENSAL ALUGUEL: R$ @@_VALOR_ALUGUEL</p><p>      </p><p>      PRAZO CONTRATO EM MESES: @@_PRAZO_CONTRATO</p><p>      </p><p>      PERÍODO: @@_DATA_INICIO_CONTRATO a @@_DATA_FIM_CONTRATO</p><p>      </p><p>      DATA PRIMEIRO ALUGUEL: @@_DATA_PRIMEIRO_ALUGUEL</p><p>	  </p><p>	  CLAUSULA ADICIONAL: @@_CLAUSULA_ISENCAO</p><p>	</p><p>	  Para acompanhar os pagamentos de seus aluguéis, acesse nosso site www.masterimoveis.com.br, em Extrato Financeiro, digite seu CPF e seu código de acesso: @@_CODIGO_PROPRIETARIO</p><p>	</p><p>	  OBS: No primeiro mês de contrato poderá ocorrer desconto de dias de aluguel referente a data da entrega das chaves do imóvel ao locatário.</p><p><br></p><p>	  </p><p>      TRABALHAMOS PARA QUE CADA VEZ MAIS E MELHOR POSSAMOS SERVIR AOS NOSSOS CLIENTES QUE SÃO RAZÃO DA EXISTÊNCIA DA NOSSA EMPRESA</p>`;
    }

    return text;
  }
}

module.exports = LetterAndDocumentsService;
