export const FAVOURITE_ACTIONS = {
  add: "add",
  remove: "remove",
};

export const columnNames = {
  name: "Name",
  price: "Price",
  "24h": "24h",
  "7d": "7d",
  "Circ. supply": "Circ. supply",
  "Total supply": "Total supply",
  "Market Cap": "Market Cap",
  Symbol: "Symbol",
  FDV: "FDV",
  "Volume (24H)": "Volume (24H)",
  ATH: "ATH",
  "ATH Date": "ATH Date",
  "24 High": "24 High",
  "24 Low": "24 Low",
  "Last Updated": "Last Updated",
};

export const hiddenColumns = [];

export const visibleColumns = [
  columnNames.name,
  columnNames.price,
  columnNames["24h"],
  columnNames["7d"],
  columnNames["Circ. supply"],
  columnNames["Total supply"],
  columnNames["Market Cap"],
  columnNames.Symbol,
  columnNames.FDV,
  columnNames["Volume (24H)"],
  columnNames.ATH,
  columnNames["ATH Date"],
  columnNames["24 High"],
  columnNames["24 Low"],
  columnNames["Last Updated"],
];
