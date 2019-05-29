'use strict'
const edge = use('edge.js')
const { removeAccent } = use('App/Helpers/String')
const numeral = use('numeral')
const moment = use('moment')

if (!numeral.locales['pt-br']) {

  numeral.register('locale', 'pt-br', {
    delimiters: {
      thousands: '.',
      decimal: ','
    },
    currency: {
      symbol: 'R$'
    }
  })
  numeral.locale('pt-br')

}


edge.global('moneyFormat', function (number) {
  if (!number) {
    number = 0
  }
  return numeral(parseFloat(number)).format('0,0.00')
})


edge.global('dateExtensive', function (data) {
  if (!data) {
    data = moment().format('YYYY-MM-DD')
  }

  data = new Date(data);

  const day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay() + 1];
  const date = data.getDate() + 1;
  const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
  const year = data.getFullYear();


  return `${day}, ${date} de ${month} de ${year}`
})


edge.global('zeroToLeft', function (number) {

  if (number < 10) {
    return ('00' + number).slice(-2)
  }
  return number
})


edge.global('setMask', function (mask, number) {

  var s = '' + number, r = '';
  for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
    r += mask.charAt(im) == 'X' ? s.charAt(is++) : mask.charAt(im);
  }
  return r;

})


edge.global('dateFormat', function (date, format) {

  if (!date) {
    return date
  }

  if (format == null) {
    return moment(date).format('DD/MM/YYYY')
  }

  if (format === 'YYYY-MM-DD') {
    return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  }

  return moment(date).format(format)
})

/**
 * Retorna a abreviação do tipo do imovel
 */
edge.global('abvTypeImmobile', (type) => {

  if (!type) return "";

  let data

  switch (removeAccent(type)) {
    case 'apartamento':
      data = 'ap'
      break
    case 'apartamento cobert.':
      data = 'apc'
      break
    case 'aparthotel':
      data = 'aph'
      break
    case 'area comercial':
      data = 'ac'
      break
    case 'area industrial':
      data = 'ai'
      break
    case 'barracao':
      data = 'br'
      break
    case 'box':
      data = 'box'
      break
    case 'casa comercial':
      data = 'cs'
      break
    case 'casa condominio':
      data = 'cs'
      break
    case 'casa residencial':
      data = 'cs'
      break
    case 'casa sobrado':
      data = 'cs'
      break
    case 'chacara':
      data = 'ch'
      break
    case 'galpao':
      data = 'gp'
      break
    case 'garagem':
      data = 'ga'
      break
    case 'imovel rural':
      data = 'ir'
      break
    case 'kitinete':
      data = 'kt'
      break
    case 'lote':
      data = 'lt'
      break
    case 'lote em condominio':
      data = 'lt'
      break
    case 'ponto comercial':
      data = 'pc'
      break
    case 'sala':
      data = 'sl'
      break
    case 'salao comercial':
      data = 'sl'
      break
    case 'sitio':
      data = 'st'
      break
    case 'sobreloja':
      data = 'pc'
      break
    case 'terreno comercial':
      data = 'tc'
      break
    case 'terreno industrial':
      data = 'ti'
      break
    case 'flat':
      data = 'fl'
      break
    default:
      data = '#'
  }

  return data
})

/**
 * Retorna o status da reserva
 */
edge.global('getStatusReserve', function (status) {

  if (status === "r") return "reserva";
  if (status === "d") return "documentação";
  if (status === "a") return "analise";
  if (status === "cd") return "cadastro";
  if (status === "p") return "pendente";
  if (status === "as") return "assinado";
  if (status === "ap") return "assinado c/ pend";
  if (status === "af") return "ativ. finais";
  if (status === "c") return "cancelado";

})

/**
 * Retorna os status da transferência
 */
edge.global('getStatusTransfer', function (status) {

  if (status === "p") return "pendente";
  if (status === "r") return "resolvido";
  if (status === "c") return "cancelado";

})

edge.global("diffDays", function (date1, date2) {

  date2 = !date2 ? moment().format("YYYY-MM-DD") : date2;

  const a = moment(date1);
  const b = moment(date2);

  return b.diff(a, 'days')
});

edge.global("nl2br", function (str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
});

