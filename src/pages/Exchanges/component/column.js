import { Avatar, Progress, Typography } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { pickerOptions } from "../../../app/component/helpers/DateFilter/constants";
import MoneyFormat from "../../../app/component/helpers/MoneyFormat";
import YesNoTagged from "../../../app/component/helpers/YesNoTagged";
import { getCountryFlag } from "../../../app/constants/countries";
import { getPercentageValue } from "../../../app/helpers/numbers";
import {
  getDateFilters,
  getNumberFilters,
  getSearchFilters,
} from "../../../utils/filters";
import { handleSort, SORT_TYPES } from "../../../utils/sorting";
import { columnNames } from "../utils/constants";

const progressProps = (score) => {
  if (score < 5) {
    return { status: "exception", format: (percent) => `${percent}%` };
  }
  if (score < 6) return { strokeColor: "#ded93e" };

  return {};
};

const exchangeColumn = (columnCustommize) => {
  const columns = [
    {
      title: columnNames.name,
      key: columnNames.name,
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
      title: columnNames["Trust Score"],
      key: columnNames["Trust Score"],
      dataIndex: "trust_score",
      sorter: (a, b) =>
        handleSort(a.trust_score, b.trust_score, SORT_TYPES.NUMBER),
      width: 150,
      render: (score) =>
        typeof score === "number" ? (
          <Progress
            {...progressProps(score)}
            size="small"
            percent={getPercentageValue(score, 0, 10)}
            strokeLinecap="butt"
          />
        ) : (
          "-"
        ),
    },
    {
      title: columnNames["Trading Volumn"],
      key: columnNames["Trading Volumn"],
      dataIndex: "trade_volume_24h_btc",
      width: 150,
      ...getNumberFilters({
        dataIndex: "trade_volume_24h_btc",
        title: "trading volume",
        suggestions: [100, 1000, 10000, 100000, 200000, 300000],
      }),
      sorter: (a, b) =>
        handleSort(
          a.trade_volume_24h_btc,
          b.trade_volume_24h_btc,
          SORT_TYPES.NUMBER
        ),
      render: (tradingVolume) => (
        <MoneyFormat
          amount={tradingVolume}
          currency=""
          addonAfter={<strong>btc</strong>}
        />
      ),
    },
    {
      title: columnNames["Established On"],
      key: columnNames["Established On"],
      dataIndex: "year_established",
      sorter: (a, b) =>
        handleSort(a.year_established, b.year_established, SORT_TYPES.NUMBER),
      ...getDateFilters({
        dataIndex: "year_established",
        title: columnNames["Established On"],
        picker: pickerOptions.year,
      }),
      width: 200,
      render: (year) => year || "-",
    },
    {
      title: columnNames.Country,
      key: columnNames.Country,
      dataIndex: "country",
      sorter: (a, b) => handleSort(a.country, b.country),
      width: 250,
      render: (country) => getCountryFlag(country),
    },

    {
      title: columnNames.Website,
      key: columnNames.Website,
      dataIndex: "url",
      width: 150,
      ...getSearchFilters({
        dataIndex: "url",
        title: "website",
      }),
      render: (url) => {
        const truncateSite = url?.substring(0, 20) || "";
        return (
          <Typography.Link ellipsis target="_blank" href={url}>
            <GoLinkExternal className="mr-2" />
            {truncateSite}
            {truncateSite.length < url?.length && "..."}
          </Typography.Link>
        );
      },
    },
    {
      title: columnNames["Has trading incentive"],
      key: columnNames["Has trading incentive"],
      dataIndex: "has_trading_incentive",
      width: 200,
      render: (hasIncentive) => <YesNoTagged condition={hasIncentive} />,
    },
  ];
  const savedColumns = columnCustommize.visible;
  const visibleColumns = columns.filter((col) =>
    savedColumns.includes(col.key)
  );

  return [...visibleColumns];
};

export default exchangeColumn;
