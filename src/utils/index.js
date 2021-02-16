const to2Decimal = value => parseFloat(value).toFixed(2);
const toDecimal = value => parseFloat(value).toFixed(0);
const moneyWithCommas = amount => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export {
  to2Decimal,
  toDecimal,
  moneyWithCommas,
};
