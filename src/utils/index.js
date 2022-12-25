import moment from "moment";

const toDecimal = (value) => parseFloat(value).toFixed(0);

const to2Decimal = (value) => {
  let result = parseFloat(value).toFixed(2);
  if (result === "0.00") {
    result = value;
  }
  return result;
};

const moneyWithCommas = (amount) => {
  const breakAmount = amount.toString().split(".");
  const preDecimal = breakAmount[0];
  const postDecimal = breakAmount[1];
  const preDecimalWithCommas = preDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const resultArry = [preDecimalWithCommas, postDecimal];
  const result = postDecimal ? resultArry.join(".") : preDecimalWithCommas;
  return result;
};

const dateFormat = (d) => moment(d).format("ll");

export { to2Decimal, toDecimal, moneyWithCommas, dateFormat };

