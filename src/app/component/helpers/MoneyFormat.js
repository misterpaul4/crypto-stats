import { formatNumber, moneyWithCommas } from "../../utils";

const MoneyFormat = ({ amount, className = "" }) => {
  return (
    <div className={className}>
      <div>{formatNumber(amount, "$")}</div>
      <small className="text-muted">{moneyWithCommas(amount, "$")}</small>
    </div>
  );
};

export default MoneyFormat;

