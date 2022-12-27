import {
  Avatar,
  Menu,
  Popconfirm,
  Popover,
  Progress,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { dateFormat, moneyWithCommas, to2Decimal } from "../utils";
import { BsThreeDots, BsEye } from "react-icons/bs";
import { FcLike } from "react-icons/fc";

const columns = (onDetailsOpen) => [
  {
    title: "Name",
    width: 300,
    fixed: "left",
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
    fixed: "left",
    ellipsis: true,
    // dataIndex: "current_price",
    // render: (d) => `$${moneyWithCommas(d)}`,
    render: (data) => {
      const percent =
        ((data.current_price - data.low_24h) / (data.high_24h - data.low_24h)) *
        100;

      return (
        <div>
          <div>${moneyWithCommas(data.current_price)}</div>
          <Progress
            percent={percent}
            showInfo={false}
            className="m-0 pr-3"
            steps={5}
          />
        </div>
      );
    },
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
    ellipsis: true,
    render: (data) => {
      if (data.circulating_supply && data.max_supply) {
        const circulating_supply = moneyWithCommas(data.circulating_supply);
        const max_supply = moneyWithCommas(data.max_supply);
        return (
          <Popover
            content={
              <div>
                <div>
                  Circulating Supply:
                  <strong className="ml-2">{circulating_supply}</strong>
                </div>
                <div>
                  Max. Supply:
                  <strong className="ml-2">{max_supply}</strong>
                </div>
              </div>
            }
          >
            <div>
              {circulating_supply} <strong>{data.symbol?.toUpperCase()}</strong>
            </div>
            <Progress
              className="m-0 pr-3"
              percent={to2Decimal(
                (data.circulating_supply / data.max_supply) * 100
              )}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Popover>
        );
      }

      return data.circulating_supply ? (
        <div>
          {moneyWithCommas(data.circulating_supply)}{" "}
          <strong>{data.symbol?.toUpperCase()}</strong>
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    title: "Total supply",
    dataIndex: "total_supply",
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
    title: <Tooltip title="Fully Diluted Valuation">FDV</Tooltip>,
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
    width: 150,
    ellipsis: true,
    dataIndex: "ath_date",
    render: (d) => (d ? dateFormat(d) : "-"),
  },
  {
    title: "24 High",
    width: 150,
    ellipsis: true,
    dataIndex: "high_24h",
    className: "text-success",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "24 Low",
    width: 150,
    ellipsis: true,
    dataIndex: "low_24h",
    className: "text-danger",
    render: (d) => `$${moneyWithCommas(d)}`,
  },
  {
    title: "Action",
    width: 250,
    fixed: "right",
    render: (data) => (
      <Popover
        className="mx-3"
        placement="left"
        overlayInnerStyle={{ padding: 0 }}
        zIndex={3}
        content={
          <Menu
            selectable={false}
            items={[
              {
                label: (
                  <span className="d-flex align-items-center">
                    <BsEye className="mr-2" /> View
                  </span>
                ),
                key: "view",
                onClick: () => onDetailsOpen(data),
              },
              {
                key: "favourite",
                label: (
                  <span className="d-flex align-items-center">
                    <FcLike className="mr-2" /> Add
                    <strong className="mx-1">
                      {data.symbol.toUpperCase()}
                    </strong>{" "}
                    To Favourites
                  </span>
                ),
              },
            ]}
          />
        }
        trigger="click"
      >
        <BsThreeDots size={20} className="cursor-pointer" />
      </Popover>
    ),
  },
];

export default columns;

