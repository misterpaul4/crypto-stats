/* eslint-disable react/prop-types */
import { formatNumber, moneyWithCommas } from "../../../utils";

function MoneyFormat({
  amount,
  className = "",
  currency = "$",
  addonAfter = "",
}) {
  return (
    <div className={className}>
      <div>
        {formatNumber(amount, currency)}{" "}
        {typeof amount === "number" && addonAfter}
      </div>
      <small className="text-muted">
        {moneyWithCommas(amount, currency)}{" "}
        {typeof amount === "number" && addonAfter}
      </small>
    </div>
  );
}

export default MoneyFormat;
