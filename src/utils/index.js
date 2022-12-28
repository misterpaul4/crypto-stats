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

const moneyWithCommas = (amount) => {
  if (typeof amount === "string" || typeof amount === "number") {
    const breakAmount = amount.toString().split(".");
    const preDecimal = breakAmount[0];
    const postDecimal = breakAmount[1];
    const preDecimalWithCommas = preDecimal.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    const resultArry = [preDecimalWithCommas, postDecimal];
    const result = postDecimal ? resultArry.join(".") : preDecimalWithCommas;
    return result;
  }

  return "-";
};

const dateFormat = (d) => (d ? moment(d).format("ll") : "-");

const dateFormatWithTime = (d) => (d ? moment(d).format("lll") : "-");

export {
  to2Decimal,
  toDecimal,
  moneyWithCommas,
  dateFormat,
  dateFormatWithTime,
};

