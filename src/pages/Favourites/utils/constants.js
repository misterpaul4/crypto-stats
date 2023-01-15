import { columnNames } from "../../Cryptocurrencies/utils/constants";

export const hiddenColumns = [
  columnNames.Symbol,
  columnNames.FDV,
  columnNames["Volume (24H)"],
  columnNames["ATH Date"],
  columnNames["24 High"],
  columnNames["24 Low"],
  columnNames["Last Updated"],
  columnNames["Circ. supply"],
  columnNames["Total supply"],
];

export const visibleColumns = [
  columnNames.name,
  columnNames.price,
  columnNames["24h"],
  columnNames["7d"],
  columnNames["Market Cap"],
  columnNames.ATH,
];
