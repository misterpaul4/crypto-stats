import { Avatar, Typography } from "antd";
import { countryCodes, getCountryFlag } from "../../../app/constants/countries";
import { getSearchFilters } from "../../../utils/filters";
import { handleSort, SORT_TYPES } from "../../../utils/sorting";

const exchangeColumn = () => [
  {
    title: "Name",
    fixed: "left",
    width: 150,
    sorter: (a, b) => handleSort(a.name, b.name),
    ...getSearchFilters({
      dataIndex: "name",
      placeholder: "e.g binance",
      title: "name",
    }),
    render: (data) => (
      <div className="d-flex">
        {data.trust_score_rank}.
        <Avatar size="small" src={data.image} className="ml-2 mr-3" />
        {data.name}
      </div>
    ),
  },
  {
    title: "Established On",
    dataIndex: "year_established",
    sorter: (a, b) =>
      handleSort(a.year_established, b.year_established, SORT_TYPES.NUMBER),
    width: 150,
    render: (year) => year || "-",
  },
  {
    title: "Country",
    dataIndex: "country",
    sorter: (a, b) => handleSort(a.country, b.country),
    width: 150,
    render: (country) => getCountryFlag(country),
  },
  {
    title: "Website",
    dataIndex: "url",
    width: 100,
    render: (url) => (
      <Typography.Link ellipsis target="_blank" href={url}>
        {url}
      </Typography.Link>
    ),
  },
  {
    title: "Has trading incentive",
    dataIndex: "has_trading_incentive",
    width: 150,

    render: (hasIncentive) => "-",
  },
  {
    title: "Trust Score",
    dataIndex: "trust_score",
    width: 150,
  },
  {
    title: "Trust Score Rank",
    dataIndex: "trust_score_rank",
    width: 150,
  },
  {
    title: "Trading Volumn",
    dataIndex: "trade_volume_24h_btc",
    width: 150,

    render: (tradingVolume) => `${tradingVolume} btc`,
  },
];

export default exchangeColumn;
