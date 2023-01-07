import { Avatar, Menu, Popover, Progress, Tag, Tooltip } from "antd";
import {
  dateFormat,
  dateFormatWithTime,
  moneyWithCommas,
  to2Decimal,
} from "../utils";
import { BsThreeDots, BsEye } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { handleSort, SORT_TYPES } from "../utils/sorting";
import MoneyFormat from "../../../app/component/helpers/MoneyFormat";
import {
  getDateFilters,
  getNumberFilters,
  getSearchFilters,
  numberFilterSuggestions,
} from "../utils/filters";

const columns = (onDetailsOpen) => [
  {
    title: "Name",
    fixed: "left",
    sorter: (a, b) => handleSort(a.name, b.name),
    ...getSearchFilters({
      dataIndex: "name",
      placeholder: "e.g bitcoin",
      title: "name",
    }),
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
    sorter: (a, b) =>
      handleSort(a.current_price, b.current_price, SORT_TYPES.NUMBER),
    ...getNumberFilters({
      dataIndex: "current_price",
      suggestions: numberFilterSuggestions.price,
      title: "price",
    }),
    render: (data) => {
      const percent =
        ((data.current_price - data.low_24h) / (data.high_24h - data.low_24h)) *
        100;

      return (
        <div>
          <div>{moneyWithCommas(data.current_price, "$")}</div>
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
    sorter: (a, b) =>
      handleSort(
        a.price_change_percentage_24h,
        b.price_change_percentage_24h,
        SORT_TYPES.NUMBER
      ),
    ...getNumberFilters({
      dataIndex: "price_change_percentage_24h",
      suggestions: numberFilterSuggestions.percentage,
      title: "24H",
    }),
    dataIndex: "price_change_percentage_24h",
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "7d",
    width: 150,
    sorter: (a, b) =>
      handleSort(
        a.price_change_percentage_7d_in_currency,
        b.price_change_percentage_7d_in_currency,
        SORT_TYPES.NUMBER
      ),
    dataIndex: "price_change_percentage_7d_in_currency",
    ...getNumberFilters({
      dataIndex: "price_change_percentage_7d_in_currency",
      suggestions: numberFilterSuggestions.percentage,
      title: "7D",
    }),
    render: (d) => <Tag color={d < 0 ? "red" : "green"}>{to2Decimal(d)}%</Tag>,
  },
  {
    title: "Circ. supply",
    width: 250,
    sorter: (a, b) =>
      handleSort(a.circulating_supply, b.circulating_supply, SORT_TYPES.NUMBER),
    ...getNumberFilters({
      dataIndex: "circulating_supply",
      suggestions: numberFilterSuggestions.supply,
      title: "circ. supply",
    }),
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
    ...getNumberFilters({
      dataIndex: "total_supply",
      suggestions: numberFilterSuggestions.supply,
      title: "total supply",
    }),
    sorter: (a, b) =>
      handleSort(a.total_supply, b.total_supply, SORT_TYPES.NUMBER),
    render: (d) => moneyWithCommas(d),
  },
  {
    title: "Market Cap",
    dataIndex: "market_cap",
    width: 150,
    ...getNumberFilters({
      dataIndex: "market_cap",
      suggestions: numberFilterSuggestions.cap,
      title: "market cap",
    }),
    sorter: (a, b) => handleSort(a.market_cap, b.market_cap, SORT_TYPES.NUMBER),
    render: (d) => <MoneyFormat className="mx-3" amount={d} />,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    width: 150,
    sorter: (a, b) => handleSort(a.symbol, b.symbol),
    ...getSearchFilters({
      dataIndex: "symbol",
      placeholder: "e.g btc",
      title: "symbol",
    }),
    render: (d) => <Tag>{d}</Tag>,
  },
  {
    title: <Tooltip title="Fully Diluted Valuation">FDV</Tooltip>,
    dataIndex: "fully_diluted_valuation",
    ...getNumberFilters({ dataIndex: "fully_diluted_valuation", title: "fdv" }),
    width: 150,
    sorter: (a, b) =>
      handleSort(
        a.fully_diluted_valuation,
        b.fully_diluted_valuation,
        SORT_TYPES.NUMBER
      ),
    render: (d) => <MoneyFormat amount={d} />,
  },
  {
    title: "Volume (24H)",
    width: 200,
    dataIndex: "total_volume",
    sorter: (a, b) =>
      handleSort(a.total_volume, b.total_volume, SORT_TYPES.NUMBER),
    ...getNumberFilters({
      dataIndex: "total_volume",
      suggestions: numberFilterSuggestions.supply,
      title: "total volume",
    }),
    render: (d) => <MoneyFormat amount={d} />,
  },
  {
    title: <Tooltip title="All Time High">ATH</Tooltip>,
    sorter: (a, b) => handleSort(a.ath, b.ath, SORT_TYPES.NUMBER),
    width: 150,
    ...getNumberFilters({
      dataIndex: "ath",
      suggestions: numberFilterSuggestions.price,
      title: "ath",
    }),
    dataIndex: "ath",
    render: (d) => moneyWithCommas(d, "$"),
  },
  {
    title: <Tooltip title="All Time High Date">ATH Date</Tooltip>,
    width: 150,
    sorter: (a, b) => handleSort(a.ath_date, b.ath_date),
    ...getDateFilters({ dataIndex: "ath_date", title: "ath date" }),
    dataIndex: "ath_date",
    render: (d) => dateFormat(d),
  },
  {
    title: "24 High",
    sorter: (a, b) => handleSort(a.high_24h, b.high_24h, SORT_TYPES.NUMBER),
    ...getNumberFilters({
      dataIndex: "high_24h",
      suggestions: numberFilterSuggestions.price,
      title: "24 high",
    }),
    dataIndex: "high_24h",
    width: 150,
    className: "text-success",
    render: (d) => moneyWithCommas(d, "$"),
  },
  {
    title: "24 Low",
    sorter: (a, b) => handleSort(a.low_24h, b.low_24h, SORT_TYPES.NUMBER),
    ...getNumberFilters({
      dataIndex: "low_24h",
      suggestions: numberFilterSuggestions.price,
      title: "24 low",
    }),
    dataIndex: "low_24h",
    width: 150,
    className: "text-danger",
    render: (d) => moneyWithCommas(d, "$"),
  },
  {
    title: "Last Updated",
    dataIndex: "last_updated",
    width: 200,
    sorter: (a, b) => handleSort(a.last_updated, b.last_updated),
    render: (d) => dateFormatWithTime(d),
  },
  {
    title: "Action",
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
                    <BsEye className="mr-2" /> Quick Look
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

