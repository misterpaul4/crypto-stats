import { formatNumber, moneyWithCommas } from "../../../utils";

const MoneyFormat = ({
  amount,
  className = "",
  currency = "$",
  addonAfter = "",
}) => {
  return (
    <div className={className}>
      <div>
        {formatNumber(amount, currency)} {addonAfter}
      </div>
      <small className="text-muted">
        {moneyWithCommas(amount, currency)} {addonAfter}
      </small>
    </div>
  );
};

export default MoneyFormat;
