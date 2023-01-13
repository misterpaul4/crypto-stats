import moment from "moment";

const toDecimal = (value) => parseFloat(value).toFixed(0);

const to2Decimal = (value) => {
  if (typeof value === "number" || typeof value === "string") {
    let result = parseFloat(value).toFixed(2);
    if (result === "0.00") {
      result = value;
    }
    return result;
  }

  return "-";
};

const moneyWithCommas = (amount, currency = "") => {
  if (typeof amount === "number") {
    const breakAmount = amount.toString().split(".");
    const preDecimal = breakAmount[0];
    const postDecimal = breakAmount[1];
    const preDecimalWithCommas = preDecimal.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    const resultArry = [preDecimalWithCommas, postDecimal];
    const result = postDecimal ? resultArry.join(".") : preDecimalWithCommas;
    return currency + result;
  }

  return "-";
};

function formatNumber(num, currency = "", decimal = 1) {
  if (typeof num === "number") {
    if (num >= 1000000000000) {
      return `${currency + (num / 1000000000000).toFixed(decimal)} T`;
    }
    if (num >= 1000000000) {
      return `${currency + (num / 1000000000).toFixed(decimal)} B`;
    }
    if (num >= 1000000) {
      return `${currency + (num / 1000000).toFixed(decimal)} M`;
    }
    if (num >= 1000) {
      return `${currency + (num / 1000).toFixed(decimal)} K`;
    }
    return currency + num.toString();
  }

  return "-";
}

const numberInputFormatter = (num) => {
  const formattedNum = num.toString();
  const parts = formattedNum.split(".");
  let wholeNumber = parts[0];
  const decimal = parts[1];
  wholeNumber = wholeNumber.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  if (decimal) {
    return `${wholeNumber}.${decimal}`;
  }
  return wholeNumber;
};

const dateFormat = (d) => {
  if (d) {
    const [date] = d.split("T");
    return moment(date).format("MMM Do, YYYY");
  }

  return "-";
};

const dateFormatWithTime = (d) => (d ? moment(d).format("lll") : "-");

export {
  to2Decimal,
  toDecimal,
  moneyWithCommas,
  dateFormat,
  dateFormatWithTime,
  formatNumber,
  numberInputFormatter,
};
