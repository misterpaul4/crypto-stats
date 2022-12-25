import { Avatar, Tag } from "antd";
import { moneyWithCommas, to2Decimal } from "../utils";

const columns = () => [
  {
    title: "rank",
    dataIndex: "market_cap_rank",
    width: 150,
  },
  {
    title: "name",
    width: 150,
    render: (data) => (
      <>
        <Avatar size="small" src={data.image} className="mr-2" />
        {data.name}
      </>
    ),
  },
  {
    title: "Price",
    width: 150,
    dataIndex: "current_price",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "24h",
    width: 150,
    dataIndex: "price_change_percentage_24h",
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "7d",
    dataIndex: "price_change_percentage_7d_in_currency",
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "circ. supply",
    dataIndex: "circulating_supply",
    render: (d) => (d ? moneyWithCommas(d) : "-"),
  },
  {
    title: "total supply",
    dataIndex: "max_supply",
    render: (d) => (d ? moneyWithCommas(d) : "-"),
  },
  {
    title: "Market Cap",
    dataIndex: "market_cap",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
];

export default columns;

