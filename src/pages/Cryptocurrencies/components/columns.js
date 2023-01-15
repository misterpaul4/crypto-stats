import { Avatar, Dropdown, Menu, Popover, Progress, Tag, Tooltip } from "antd";
import { BsThreeDots, BsEye } from "react-icons/bs";
import {
  dateFormat,
  dateFormatWithTime,
  moneyWithCommas,
  to2Decimal,
} from "../../../utils/index";
import { handleSort, SORT_TYPES } from "../../../utils/sorting";
import MoneyFormat from "../../../app/component/helpers/MoneyFormat";
import {
  getDateFilters,
  getNumberFilters,
  getSearchFilters,
  numberFilterSuggestions,
} from "../../../utils/filters";
import {} from "../../../app/helpers/localStorageActions";
import { columnNames } from "../utils/constants";

export const commonColumns = [
  {
    title: columnNames.name,
    key: columnNames.name,
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
    title: columnNames.price,
    key: columnNames.price,
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
    title: columnNames["24h"],
    key: columnNames["24h"],
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
    title: columnNames["7d"],
    key: columnNames["7d"],
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
    title: columnNames["Circ. supply"],
    key: columnNames["Circ. supply"],
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
    title: columnNames["Total supply"],
    key: columnNames["Total supply"],
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
    title: columnNames["Market Cap"],
    key: columnNames["Market Cap"],
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
    title: columnNames.Symbol,
    key: columnNames.Symbol,
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
    title: <Tooltip title="Fully Diluted Valuation">{columnNames.FDV}</Tooltip>,
    key: columnNames.FDV,
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
    title: columnNames["Volume (24H)"],
    key: columnNames["Volume (24H)"],
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
    title: <Tooltip title="All Time High">{columnNames.ATH}</Tooltip>,
    key: columnNames.ATH,
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
    title: (
      <Tooltip title="All Time High Date">{columnNames["ATH Date"]}</Tooltip>
    ),
    key: columnNames["ATH Date"],
    width: 150,
    sorter: (a, b) => handleSort(a.ath_date, b.ath_date),
    ...getDateFilters({ dataIndex: "ath_date", title: "ath date" }),
    dataIndex: "ath_date",
    render: (d) => dateFormat(d),
  },
  {
    title: columnNames["24 High"],
    key: columnNames["24 High"],
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
    title: columnNames["24 Low"],
    key: columnNames["24 Low"],
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
    title: columnNames["Last Updated"],
    key: columnNames["Last Updated"],
    dataIndex: "last_updated",
    width: 200,
    sorter: (a, b) => handleSort(a.last_updated, b.last_updated),
    render: (d) => dateFormatWithTime(d),
  },
];

const columns = (onDetailsOpen, columnCustommize) => {
  const savedColumns = columnCustommize.visible;
  const visibleColumns = commonColumns.filter((col) =>
    savedColumns.includes(col.key)
  );

  return [
    ...visibleColumns,
    {
      fixed: "right",
      render: (data) => (
        <Dropdown
          className="mx-3"
          placement="left"
          trigger="click"
          overlay={
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
              ]}
            />
          }
        >
          <BsThreeDots size={20} className="cursor-pointer" />
        </Dropdown>
      ),
    },
  ];
};

export default columns;
