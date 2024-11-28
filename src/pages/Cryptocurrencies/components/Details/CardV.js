// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import MoneyFormat from "../../../../app/component/helpers/MoneyFormat";
import { to2Decimal } from "../../../../utils";

function CardV({ title, value, percentageChange = 0 }) {
  return (
    <div className="px-4 py-3 text-center rounded shadow-sm">
      <div className="text-muted" style={{ fontSize: "0.8rem" }}>
        {title}
      </div>
      <div className="d-flex align-items-center">
        <strong className="mr-2">
          {" "}
          <MoneyFormat amount={value} short />
        </strong>{" "}
        {percentageChange ? (
          <span
            className={percentageChange > 0 ? "text-success" : "text-danger"}
            style={{ fontSize: "0.7rem" }}
          >
            {to2Decimal(percentageChange)}{" "}
            {percentageChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default CardV;
