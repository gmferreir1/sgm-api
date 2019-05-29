const moment = use('moment')

class DateTime {

  static dateFormat(date, format = null) {

    if (!date) {
      return date
    }

    if (format == null) {
      return moment(date).format('DD/MM/YYYY')
    }

    if (format === 'YYYY-MM-DD') {
      return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }

    return moment(date, "YYYY-MM-DD").format(format)
  }

  static datesDefaultSystem() {

    return {
      init_date: '1984-02-29',
      end_date: '2099-02-29',
      init_date_current_month: moment().startOf('month').format('YYYY-MM-DD'),
      end_date_current_month: moment().endOf('month').format('YYYY-MM-DD'),
    }

  }

  /**
   * Retorna a data por extenso
   * @param data
   * @returns {string}
   */
  static dateExtense(data) {

    if (!data) return ''

    data = new Date(data);

    const day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay() + 1];
    const date = data.getDate() + 1;
    const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
    const year = data.getFullYear();


    return `${day}, ${date} de ${month} de ${year}`
  }

  static durationDays(diffInDays, showDays = false) {

    let time = diffInDays * 24 * 3600;

    let _return = []
    let years = Math.floor(time / (86400 * 365))
    time = time % (86400 * 365)
    let month = Math.floor(time / (86400 * 30))
    time = time % (86400 * 30)
    let days = Math.floor(time / 86400)
    time = time % 86400
    time = time % 3600

    if (showDays) {

      if (years > 0) _return.push(years + ' ano' + (years > 1 ? 's' : ' '));
      if (month > 0) _return.push(month + ' mes' + (month > 1 ? 'es' : ' '));
      if (days > 0) _return.push(days + ' dia' + (days > 1 ? 's' : ' '));

    } else {
      
      if (years > 0) _return.push(years);
      if (month > 0) _return.push(month);
      if (days > 0) _return.push(days);
    
    }
   

    return _return
  }

}

module.exports = DateTime