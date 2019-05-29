const numeral = use("numeral");
numeral.register("locale", "pt-br", {
  delimiters: {
    thousands: ".",
    decimal: ","
  },
  currency: {
    symbol: "R$"
  }
});

numeral.locale("pt-br");

class String {
  static toLowerCase(data) {
    if (typeof data === "object") {
      const props = Object.keys(data);
      props.map(key =>
        typeof data[key] === "string"
          ? (data[key] = data[key].toLowerCase())
          : data[key]
      );
    }

    return data;
  }

  static removeAccent(stringParam) {
    var string = stringParam;
    var mapAaccent = {
      a: /[\xE0-\xE6]/g,
      A: /[\xC0-\xC6]/g,
      e: /[\xE8-\xEB]/g,
      E: /[\xC8-\xCB]/g,
      i: /[\xEC-\xEF]/g,
      I: /[\xCC-\xCF]/g,
      o: /[\xF2-\xF6]/g,
      O: /[\xD2-\xD6]/g,
      u: /[\xF9-\xFC]/g,
      U: /[\xD9-\xDC]/g,
      c: /\xE7/g,
      C: /\xC7/g,
      n: /\xF1/g,
      N: /\xD1/g
    };

    for (var word in mapAaccent) {
      var expressaoRegular = mapAaccent[word];
      string = string.replace(expressaoRegular, word);
    }

    return string;
  }

  /***
   * Retorna o nome do mes
   * @param {*} monthNumber
   */
  static getMonthName(monthNumber) {
    const month = parseInt(monthNumber);

    if (month === 1) {
      return "janeiro";
    }

    if (month === 2) {
      return "fevereiro";
    }

    if (month === 3) {
      return "março";
    }

    if (month === 4) {
      return "abril";
    }

    if (month === 5) {
      return "maio";
    }

    if (month === 6) {
      return "junho";
    }

    if (month === 7) {
      return "julho";
    }

    if (month === 8) {
      return "agosto";
    }

    if (month === 9) {
      return "setembro";
    }

    if (month === 10) {
      return "outubro";
    }

    if (month === 11) {
      return "novembro";
    }

    if (month === 12) {
      return "dezembro";
    }
  }

  static moneyFormat(number) {
    if (!number) {
      number = 0;
    }
    return numeral(parseFloat(number)).format("0,0.00");
  }

  static setMask(mask, number) {
    number = number.replace(/[^0-9]/g, "");

    var s = "" + number,
      r = "";
    for (var im = 0, is = 0; im < mask.length && is < s.length; im++) {
      r += mask.charAt(im) == "X" ? s.charAt(is++) : mask.charAt(im);
    }
    return r;
  }

  static nl2br(str, is_xhtml) {
    var breakTag =
      is_xhtml || typeof is_xhtml === "undefined" ? "<br " + "/>" : "<br>";
    return (str + "").replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
      "$1" + breakTag + "$2"
    );
  }
}

module.exports = String;
