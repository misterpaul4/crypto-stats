import { Avatar, Tag, Tooltip, Typography } from "antd";
import { dateFormat, moneyWithCommas, to2Decimal } from "../utils";

const columns = () => [
  {
    title: "name",
    width: 250,
    fixed: true,
    render: (data) => (
      <div className="d-flex">
        {data.market_cap_rank}.
        <Avatar size="small" src={data.image} className="ml-1 mr-2" />
        {data.name}
      </div>
    ),
  },

  {
    title: "Price",
    width: 150,
    ellipsis: true,
    dataIndex: "current_price",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "24h",
    width: 150,
    ellipsis: true,
    dataIndex: "price_change_percentage_24h",
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "7d",
    width: 150,
    ellipsis: true,
    dataIndex: "price_change_percentage_7d_in_currency",
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "Circ. supply",
    width: 150,
    ellipsis: true,
    dataIndex: "circulating_supply",
    render: (d) => (d ? moneyWithCommas(d) : "-"),
  },
  {
    title: "Total supply",
    dataIndex: "max_supply",
    width: 150,
    ellipsis: true,
    render: (d) => (d ? moneyWithCommas(d) : "-"),
  },
  {
    title: "Market Cap",
    dataIndex: "market_cap",
    width: 150,
    ellipsis: true,
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    width: 150,
    ellipsis: true,
    render: (d) => <Tag>{d}</Tag>,
  },
  {
    title: "FDV",
    dataIndex: "fully_diluted_valuation",
    width: 150,
    ellipsis: true,
    render: (d) => (d ? `$${moneyWithCommas(d)}` : "-"),
  },
  {
    title: "Total Volume",
    dataIndex: "total_volume",
    width: 150,
    ellipsis: true,
    render: (d) => moneyWithCommas(d),
  },
  {
    title: <Tooltip title="All Time High">ATH</Tooltip>,
    width: 150,
    ellipsis: true,
    dataIndex: "ath",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: <Tooltip title="All Time High Date">ATH Date</Tooltip>,
    dataIndex: "atl_date",
    width: 150,
    ellipsis: true,
    render: (d) => dateFormat(d),
  },
  {
    title: "24 High",
    width: 150,
    ellipsis: true,
    dataIndex: "high_24h",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "24 Low",
    width: 150,
    ellipsis: true,
    dataIndex: "low_24h",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
];

export default columns;

