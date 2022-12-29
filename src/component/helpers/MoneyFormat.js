import { formatNumber, moneyWithCommas } from "../../utils";

const MoneyFormat = ({ amount }) => {
  return (
    <>
      <div>{formatNumber(amount, "$")}</div>
      <small className="text-muted">{moneyWithCommas(amount, "$")}</small>
    </>
  );
};

export default MoneyFormat;

