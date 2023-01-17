import { Image, Typography } from "antd";
import { GoLinkExternal } from "react-icons/go";
import { pickerOptions } from "../../../app/component/helpers/DateFilter/constants";
import MoneyFormat from "../../../app/component/helpers/MoneyFormat";
import { getCountryFlag } from "../../../app/constants/countries";
import {
  getDateFilters,
  getNumberFilters,
  getSearchFilters,
} from "../../../utils/filters";
import { handleSort, SORT_TYPES } from "../../../utils/sorting";
import { columnNames, derivativeColumnNames } from "../utils/constants";

const derivativesColumn = (columnCustommize) => {
  const columns = [
    {
      title: derivativeColumnNames.name,
      key: derivativeColumnNames.name,
      fixed: "left",
      width: 150,
      sorter: (a, b) => handleSort(a.name, b.name),
      ...getSearchFilters({
        dataIndex: "name",
        placeholder: "e.g binance",
        title: "name",
      }),
      render: (data) => (
        <div className="d-flex align-items-center">
          <Image preview={false} width={30} src={data.image} />
          <span className="ml-2">{data.name}</span>
        </div>
      ),
    },
    {
      title: derivativeColumnNames.open_interest_btc,
      key: derivativeColumnNames.open_interest_btc,
      dataIndex: "open_interest_btc",
      width: 150,
      ...getNumberFilters({
        dataIndex: "open_interest_btc",
        title: "open interest",
        suggestions: [100, 1000, 10000, 100000, 200000, 300000],
      }),
      sorter: (a, b) =>
        handleSort(a.open_interest_btc, b.open_interest_btc, SORT_TYPES.NUMBER),
      render: (openInyerest) => (
        <MoneyFormat
          amount={openInyerest}
          currency=""
          addonAfter={<strong>btc</strong>}
        />
      ),
    },
    {
      title: derivativeColumnNames.number_of_perpetual_pairs,
      key: derivativeColumnNames.number_of_perpetual_pairs,
      dataIndex: "number_of_perpetual_pairs",
      width: 200,
      sorter: (a, b) =>
        handleSort(
          a.number_of_perpetual_pairs,
          b.number_of_perpetual_pairs,
          SORT_TYPES.NUMBER
        ),
      ...getNumberFilters({
        dataIndex: "number_of_perpetual_pairs",
        title: derivativeColumnNames.number_of_perpetual_pairs,
      }),
    },
    {
      title: derivativeColumnNames.number_of_futures_pairs,
      key: derivativeColumnNames.number_of_futures_pairs,
      dataIndex: "number_of_futures_pairs",
      width: 200,
      sorter: (a, b) =>
        handleSort(
          a.number_of_futures_pairs,
          b.number_of_futures_pairs,
          SORT_TYPES.NUMBER
        ),
      ...getNumberFilters({
        dataIndex: "number_of_futures_pairs",
        title: derivativeColumnNames.number_of_futures_pairs,
      }),
    },
    {
      title: derivativeColumnNames["Trading Volumn"],
      key: derivativeColumnNames["Trading Volumn"],
      dataIndex: "trade_volume_24h_btc",
      width: 200,
      ...getNumberFilters({
        dataIndex: "trade_volume_24h_btc",
        title: "trading volume",
        suggestions: [100, 1000, 10000, 100000, 200000, 300000],
      }),
      sorter: (a, b) =>
        handleSort(
          +a.trade_volume_24h_btc,
          +b.trade_volume_24h_btc,
          SORT_TYPES.NUMBER
        ),
      render: (tradingVolume) => (
        <MoneyFormat
          amount={+tradingVolume}
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
      ...getSearchFilters({ dataIndex: "country", title: columnNames.Country }),
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
  ];
  const savedColumns = columnCustommize.visible;
  const visibleColumns = columns.filter((col) =>
    savedColumns.includes(col.key)
  );

  return [...visibleColumns];
};

export default derivativesColumn;
